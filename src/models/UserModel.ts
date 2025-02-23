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

  // Méthode pour enregistrer une recharge de solde dans la table recharge_solde
  async saveRechargeSolde(data: { orderNumber: string, ref: string, phone: string, amount: number, id_etudiant: number, currency: string }) {
    
    const query = `
      INSERT INTO recharge_solde (orderNumber, ref, phone, amount, statut, id_etudiant, currency)
      VALUES (?, ?, ?, ?, 'PENDING', ?, ?)
    `;
    return this.executeQuery(query, [
      data.orderNumber,
      data.ref,
      data.phone,
      data.amount,
      data.id_etudiant,
      data.currency
    ]);
  }


  // Présence: Enregistrer un étudiant dans la table lecon_presence
  async newPresence(data: { etudiantId: number, leconId: number, coords: string }) {
    const query = `INSERT INTO lecon_presence(id_etudiant, statut, id_lecon, coords) 
                  VALUES (?, 'True', ?, ?)
    `;
    return this.executeQuery(query, [data.etudiantId, data.leconId, data.coords]);
  }

  async getPresence(etudiantId: number, leconId: number) {
    const query = 'SELECT * FROM lecon_presence WHERE id_etudiant = ? AND id_lecon = ?';
    return this.executeQuery(query, [etudiantId, leconId]);
  }

  // Méthode pour supprimer une ligne de la table paiement selon l'id
  async deletePayment(paymentId: number) {
    const query = `DELETE FROM recharge_solde WHERE id = ?`;
    return this.executeQuery(query, [paymentId]);
  }


  async login(matricule: string, password: string) {
    const hashedPassword = this.hashPassword(password);
    console.log({ matricule, hashedPassword });
    const query = `SELECT etudiant.*, v.id_province, origin.id_ville, v.nomVille AS "ville", origin.id AS 'originId'
                  FROM etudiant
                  INNER JOIN origine_etudiant origin ON origin.id_etudiant = etudiant.id
                  INNER JOIN ville v ON v.id = origin.id_ville
                  WHERE matricule = ? AND mdp = ?`;
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
    const query = 'UPDATE etudiant SET solde = ? WHERE id = ?';
    return this.executeQuery(query, [amount, userId]);
  }

  async photo(data: { userId: number, photoUrl: string }) {
    const query = 'UPDATE etudiant SET avatar = ? WHERE id = ?';
    return this.executeQuery(query, [data.photoUrl, data.userId]);
  }

  async changeVilleUser(data: { userId: number, villeId: number }) {
    const query = 'UPDATE origine_etudiant SET id_ville = ? WHERE id_etudiant = ?';
    return this.executeQuery(query, [data.villeId, data.userId]);
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

  async getAllProvinces() {
    const query = 'SELECT * FROM province';
    return this.executeQuery(query, []);
  }

  async getProvinceByNom(nomProvince : string){
    const query = `SELECT * FROM province WHERE nomProvince LIKE ?`;
    return this.executeQuery(query, [`%${nomProvince}%`]);
  }

  async getProvinceById(id : number){
    const query = `SELECT * FROM province WHERE id = ?`;
    return this.executeQuery(query, [id]);
  }

  async createProvince(data: { province: string }) {
    const query = `INSERT INTO province(id_pays, nomProvince) 
                  VALUES (1, ?)
    `;
    return this.executeQuery(query, [ data.province ]);
  }

  async getAllVilles(id: number) {
    const query = 'SELECT * FROM ville WHERE id_province = ?';
    return this.executeQuery(query, [id]);
  }

  async getVilleByNom(nomVille : string){
    const query = `SELECT * FROM ville WHERE nomVille LIKE ?`;
    return this.executeQuery(query, [`%${nomVille}%`]);
  }

  async getVilleById(id : number){
    const query = `SELECT * FROM ville WHERE id = ?`;
    return this.executeQuery(query, [id]);
  }

  async createVille(data: { province: number, ville: string }) {
    const query = `INSERT INTO ville(id_province, nomVille) 
                  VALUES (?, ?)
    `;
    return this.executeQuery(query, [ data.province, data.ville ]);
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