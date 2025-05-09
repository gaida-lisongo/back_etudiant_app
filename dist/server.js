"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.io = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
exports.pool = database_1.default;
const routes_1 = __importDefault(require("./routes"));
const PromotionModel_1 = __importDefault(require("./models/PromotionModel"));
const UserModel_1 = __importDefault(require("./models/UserModel"));
const sms_1 = require("./utils/sms");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});
exports.io = io;
const promotionModel = new PromotionModel_1.default();
const userModel = new UserModel_1.default();
// Global array to store connected students
let studentsConnected = [];
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
];
// Enable CORS for Express
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Use the API routes
app.use(routes_1.default);
// Test database connection
// pool.getConnection()
//   .then(connection => {
//     console.log('Database connection successful');
//     connection.release();
//   })
//   .catch(err => {
//     console.error('Error connecting to the database:', err);
//   });
//Socket.Io events
io.on('connection', (socket) => {
    console.log('User connected : ', studentsConnected);
    // Handle student connection with user data
    socket.on('studentConnect', (userData) => {
        const newStudent = {
            connectionId: socket.id,
            user: Object.assign(Object.assign({}, userData), { dateConnected: new Date().toISOString() }),
            notifications: []
        };
        studentsConnected.push(newStudent);
        console.log(`Students connected : `, studentsConnected);
        // Emit all notifications to the student
        const studentIndex = studentsConnected.findIndex(student => student.user.matricule === userData.matricule);
        socket.emit('allNotifications', studentsConnected[studentIndex].notifications);
    });
    // Handle disconnect
    socket.on('disconnect', () => {
        studentsConnected = studentsConnected.filter(student => student.connectionId !== socket.id);
        console.log('User disconnected, currents users:', studentsConnected);
    });
    socket.on('studentDisconnect', matricule => {
        studentsConnected = studentsConnected.filter(student => student.user.matricule !== matricule);
        console.log('User disconnected, currents users:', studentsConnected);
    });
    socket.on('addRecours', (_a) => __awaiter(void 0, [_a], void 0, function* ({ course, object, content, url, recoursId, courseId, matricule }) {
        /*
        1. Get index on this socket in studentsConnected, with key connectionId
        2. Add notification to the student in studentsConnected
        3. Emit notification to the student
        */
        studentsConnected.forEach(student => {
            console.log("Recours : ", { course, object, content, url, recoursId, courseId, matricule });
            if (student.user.matricule == matricule) {
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
        const currentAnnee = yield promotionModel.getThisAnnee();
        const anneeId = currentAnnee.data[0].id;
        const phoneFactory = (phone) => {
            //1. Récupérer les 9 derniers chiffres du numéro de téléphone
            //2. Ajouter +243 devant
            if (!phone) {
                return "+243813333962";
            }
            else {
                const lastNumbers = phone.slice(-9);
                return `+243${lastNumbers}`;
            }
        };
        const data = yield promotionModel.getChargeHoraire(courseId, anneeId);
        console.log("Current annee : ", data);
        const matiere = {
            intitule: data.data[0].designation,
            credit: data.data[0].credit,
            semestre: data.data[0].semestre,
            unite: data.data[0].unite,
            titualire: data.data[0].titulaire,
            phone: phoneFactory(data.data[0].phone)
        };
        const request = yield userModel.findByMatricule(matricule);
        const etudiant = {
            nom: request.data[0].nom,
            postNom: request.data[0].post_nom,
            prenom: request.data[0].prenom,
            promotion: request.data[0].promotion,
            matricule: request.data[0].matricule
        };
        console.log("Etudiant : ", etudiant);
        if (object == "Manque de cote") {
            if (data.data.length > 0) {
                (0, sms_1.sendSMS)(matiere.phone, `Cher titulaire ${matiere.titualire}), un recours a été déposé par l'étudiant ${etudiant.nom} ${etudiant.postNom} ${etudiant.prenom}.\n
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
          `)
                    .then((response) => {
                    console.log('SMS sent:', response);
                })
                    .catch((error) => {
                    console.error('SMS sending failed:', error);
                });
            }
        }
        else {
            juryContacts.forEach(contact => {
                (0, sms_1.sendSMS)(contact.phone, `Chers membre du jury ${contact.nom}, l'enseignant ${matiere.titualire}) vient de recevoir un recours par l'étudiant ${etudiant.nom} ${etudiant.postNom} ${etudiant.prenom}.\n
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
          `)
                    .then((response) => {
                    console.log('SMS sent:', response);
                })
                    .catch((error) => {
                    console.error('SMS sending failed:', error);
                });
            });
        }
    }));
    // Handle adding notifications for a student
    socket.on('addNotification', (data) => {
        const studentIndex = studentsConnected.findIndex(student => student.user.matricule === data.matricule && student.user.promotionId === data.promotionId);
        if (studentIndex !== -1) {
            studentsConnected[studentIndex].notifications.push(data.notification);
            // Emit notification to specific student
            io.to(studentsConnected[studentIndex].connectionId).emit('newNotification', data.notification);
        }
    });
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
