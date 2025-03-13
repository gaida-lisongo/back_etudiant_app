import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/database';
import apiRouter from './routes';
import PromotionModel from './models/PromotionModel';
import UserModel from './models/UserModel';
import { sendSMS } from './utils/sms';


dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});
const promotionModel = new PromotionModel(pool);
const userModel = new UserModel(pool);

interface Notification {
  title: string;
  cours: string;
  coursId: number;
  recoursId: number;
  statut: boolean;
  url?: string;
}

interface ConnectedStudent {
  connectionId: string;
  user: {
    matricule: string;
    dateConnected: string;
    nom: string;
    postNom: string;
    promotionId: number;
  };
  notifications: Notification[];
}

// Global array to store connected students
let studentsConnected: ConnectedStudent[] = [];
let juryContacts = [
  {
    phone: "+243894400024",
    nom: "Ass. MAZALA KAMOYI"
  },
  {
    phone: "+243821494937",
    nom: "Ass. DEYO MUANG"
  },
  {
    phone: "+243897263980",
    nom: "Ass. KITUBANZA SHENGA"
  },
  {
    phone: "+243813333962",
    nom: "CT. KAZADI KAKENZA"
  },
  {
    phone: "+243818142244",
    nom: "Prof. KIDIADI LEMBHI"
  }
]
// Enable CORS for Express
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the API routes
app.use(apiRouter);

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connection successful');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

//Socket.Io events
io.on('connection', (socket) => {
  console.log('User connected : ', studentsConnected);
  
  // Handle student connection with user data
  socket.on('studentConnect', (userData: {
    matricule: string;
    nom: string;
    postNom: string;
    promotionId: number;
  }) => {
    const newStudent: ConnectedStudent = {
      connectionId: socket.id,
      user: {
        ...userData,
        dateConnected: new Date().toISOString()
      },
      notifications: []
    };

    studentsConnected.push(newStudent);
    console.log(`Students connected : `, studentsConnected);

    // Emit all notifications to the student
    const studentIndex = studentsConnected.findIndex(
      student => student.user.matricule === userData.matricule
    );

    socket.emit('allNotifications', studentsConnected[studentIndex].notifications);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    studentsConnected = studentsConnected.filter(
      student => student.connectionId !== socket.id
    );
    console.log('User disconnected, currents users:', studentsConnected);
  });
  
  socket.on('studentDisconnect', matricule => {
    studentsConnected = studentsConnected.filter(
      student => student.user.matricule !== matricule
    );
    console.log('User disconnected, currents users:', studentsConnected);
  })

  socket.on('addRecours', async ({course, object, content, url, recoursId, courseId, matricule} : {course: string, object: string, content: string, url: string, recoursId: number, courseId: number, matricule: string}) => {
    
    /*
    1. Get index on this socket in studentsConnected, with key connectionId
    2. Add notification to the student in studentsConnected
    3. Emit notification to the student
    */
   studentsConnected.forEach(student => {
      console.log("Recours : ", { course, object, content, url, recoursId, courseId, matricule });
      if(student.user.matricule == matricule){
        student.notifications.push({
          title: object,
          cours: course,
          coursId: courseId,
          recoursId,
          statut: false,
          url
        });
        io.to(student.connectionId).emit('allNotifications', student.notifications);
      }
    });

    //1. Récupérer le numéro du contact de l'enseignant
    //2. Envoyer un SMS à l'enseignant
    //3. Nous recupérons le numéro de téléphone de l'enseignant de cette maniere 08...,09... mais nous devons avoir plus tot +2438..., +2439...
    interface AnneeResponse {
      data: Array<{ id: number }>;
    }
    const currentAnnee = await promotionModel.getThisAnnee() as AnneeResponse;
    
    const anneeId = currentAnnee.data[0].id;
    const phoneFactory = (phone: string) => {
      //1. Récupérer les 9 derniers chiffres du numéro de téléphone
      //2. Ajouter +243 devant
      if (!phone) {
        return "+243813333962";
      } else {
        const lastNumbers = phone.slice(-9);
        
        return `+243${lastNumbers}`;

      }
    }
    
    const data = await promotionModel.getChargeHoraire(courseId, anneeId) as { data: { phone: string, designation: string, credit: string, semestre: string, unite: string, titulaire: string }[] };
    console.log("Current annee : ", data);
    const matiere = {
      intitule: data.data[0].designation,
      credit: data.data[0].credit,
      semestre: data.data[0].semestre,
      unite: data.data[0].unite,
      titualire: data.data[0].titulaire,      
      phone: phoneFactory(data.data[0].phone)
    }

    interface UserResponse {
      data: Array<{ [key: string]: any }>;
    }

    const request = await userModel.findByMatricule(matricule) as UserResponse;
    const etudiant = {
      nom: request.data[0].nom,
      postNom: request.data[0].post_nom,
      prenom: request.data[0].prenom,
      promotion: request.data[0].promotion,
      matricule: request.data[0].matricule
    };
    console.log("Etudiant : ", etudiant)

    if (object == "Manque de cote") {
      if (data.data.length > 0) {
        sendSMS(
          matiere.phone, 
          `Cher titulaire ${matiere.titualire}), un recours a été déposé par l'étudiant ${etudiant.nom} ${etudiant.postNom} ${etudiant.prenom}.\n
          Détails du cours:\n
          Matière ${matiere.intitule} \n
          Credit : (${matiere.credit}\n
          UE : ${matiere.unite}).\n
          Semestre : ${matiere.semestre} semestre\n
          Détails du recours :\n
          Objet: ${object}\n
          Description: ${content}\n
          Date: ${new Date().toLocaleString()}
          Cours: ${course}\n
          Pièce : ${url}
          `
        )
        .then((response) => {
          console.log('SMS sent:', response);
        })
        .catch((error) => {
          console.error('SMS sending failed:', error);
        });
      }

    } else {
      juryContacts.forEach(contact => {
        sendSMS(
          contact.phone, 
          `Chers membre du jury ${matiere.titualire}), un recours a été déposé par l'étudiant ${etudiant.nom} ${etudiant.postNom} ${etudiant.prenom}.\n
          Détails du cours:\n
          Matière ${matiere.intitule} \n
          Credit : (${matiere.credit}\n
          UE : ${matiere.unite}).\n
          Semestre : ${matiere.semestre} semestre\n
          Détils du recours :\n
          Objet: ${object}\n
          Description: ${content}\n
          Date: ${new Date().toLocaleString()}
          Cours: ${course}\n
          Pièce : ${url}
          `
        )
        .then((response) => {
          console.log('SMS sent:', response);
        })
        .catch((error) => {
          console.error('SMS sending failed:', error);
        });
      });
    }
  })

  // Handle adding notifications for a student
  socket.on('addNotification', (data: {
    matricule: string;
    notification: Notification;
    promotionId: number;
  }) => {
    const studentIndex = studentsConnected.findIndex(
      student => student.user.matricule === data.matricule && student.user.promotionId === data.promotionId
    );

    if (studentIndex !== -1) {
      studentsConnected[studentIndex].notifications.push(data.notification);
      // Emit notification to specific student
      io.to(studentsConnected[studentIndex].connectionId).emit(
        'newNotification',
        data.notification
      );
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, io, pool };