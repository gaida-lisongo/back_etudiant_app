import { Pool } from 'mysql2/promise';
import Model from './Model';
import crypto from 'crypto';

interface IUser {
  id?: number;
  matricule: string;
  email: string;
  password: string;
  photo?: string;
  solde?: number;
  is_active?: boolean;
}

interface IProfile {
  userId: number;
  nom: string;
  post_nom: string;
  prenom: string;
  sexe: string;
  date_naiss: string;
  adresse: string;
  telephone: string;
  e_mail: string;
}

interface OrderResponse {
  type: string;
  data: any[];
}

export default class UserModel extends Model {
  private hashPassword(password: string): string {
    return crypto.createHash('sha1').update(password).digest('hex');
  }

  constructor(db: Pool) {
    super(db);
  }

  async login(matricule: string, password: string) {
    const hashedPassword = this.hashPassword(password);
    const query = 'SELECT * FROM etudiant WHERE matricule = ? AND mdp = ?';
    return this.executeQuery(query, [matricule, hashedPassword]);
  }

  async checkUser(email: string) {
    const query = 'SELECT * FROM etudiant WHERE e_mail = ?';
    return this.executeQuery(query, [email]);
  }

  async recovery(data: { id: number, password: string }) {
    const hashedPassword = this.hashPassword(data.password);
    const query = 'UPDATE etudiant SET mdp = ? WHERE id = ?';
    return this.executeQuery(query, [hashedPassword, data.id]);
  }

  async actif(userId: number) {
    const query = 'UPDATE etudiant SET is_active = 1 WHERE id = ?';
    return this.executeQuery(query, [userId]);
  }

  async balance(userId: number, amount: number) {
    const query = 'UPDATE etudiant SET solde = solde + ? WHERE id = ?';
    return this.executeQuery(query, [amount, userId]);
  }

  async photo(data: { userId: number, photoUrl: string }) {
    const query = 'UPDATE etudiant SET avatar = ? WHERE id = ?';
    return this.executeQuery(query, [data.photoUrl, data.userId]);
  }

  async profile(data: IProfile & { userId: number }) {
    const query = `
      UPDATE etudiant 
      SET nom = ?, 
          post_nom = ?, 
          prenom = ?, 
          sexe = ?, 
          date_naiss = ?, 
          adresse = ?, 
          telephone = ?, 
          e_mail = ? 
      WHERE id = ?`;

    return this.executeQuery(query, [
      data.nom,
      data.post_nom,
      data.prenom,
      data.sexe,
      data.date_naiss,
      data.adresse,
      data.telephone,
      data.e_mail,
      data.userId
    ]);
  }

  async secure(data: { userId: number, oldPassword: string, newPassword: string }) {
    const hashedOldPassword = this.hashPassword(data.oldPassword);
    const hashedNewPassword = this.hashPassword(data.newPassword);
    const query = 'UPDATE etudiant SET mdp = ? WHERE id = ? AND mdp = ?';
    return this.executeQuery(query, [hashedNewPassword, data.userId, hashedOldPassword]);
  }

  async findById(userId: number) {
    const query = 'SELECT * FROM etudiant WHERE id = ?';
    return this.executeQuery(query, [userId]);
  }

  async getStudentOrders(userId: number): Promise<OrderResponse[]> {
    const queries = {
      enrol: `SELECT * FROM commande_enrollement 
              WHERE id_etudiant = ? AND statut = 'OK'`,
              
      macaron: `SELECT * FROM commande_macaron cm
                INNER JOIN commande_enrollement ce ON ce.id = cm.id_commande
                WHERE ce.id_etudiant = ? AND cm.statut = 'OK'`,
                
      travaux: `SELECT * FROM commande_travail 
                WHERE id_etudiant = ? AND statut = 'OK'`,
                
      validation: `SELECT * FROM commande_validation 
                  WHERE id_etudiant = ? AND statut = 'OK'`
    };

    try {
      const [enrolResult] = await this.db.query(queries.enrol, [userId]);
      const [macaronResult] = await this.db.query(queries.macaron, [userId]);
      const [travauxResult] = await this.db.query(queries.travaux, [userId]);
      const [validationResult] = await this.db.query(queries.validation, [userId]);

      return [
        { type: 'travaux', data: travauxResult as any[] },
        { type: 'validation', data: validationResult as any[] },
        { type: 'enrol', data: enrolResult as any[] },
        { type: 'macaron', data: macaronResult as any[] }
      ];
    } catch (error) {
      console.error('Error fetching student orders:', error);
      throw error;
    }
  }
}