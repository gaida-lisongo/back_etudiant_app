import { Pool } from 'mysql2/promise';
import PromotionModel from './PromotionModel';

export default class EnrollmentModel extends PromotionModel {
  constructor(db: Pool) {
    super(db);
  }

  // 1. getSessions: List all sessions available in a promotion
  async getSessions(promotionId: number) {
    const query = `SELECT * FROM session WHERE id_promotion = ?`;
    return this.executeQuery(query, [promotionId]);
  }

  // 2. orderSession: A student orders a session enrollment
  async orderSession(data: { id_session: number, id_etudiant: number, infOperation: string }) {
    const query = `
      INSERT INTO commande_enrollement (id_session, id_etudiant, statut, id_caissier, date_creation, transaction, payment)
      VALUES (?, ?, 'OK', 20, NOW(), ?, "MOBILE MONEY")
    `;
    return this.executeQuery(query, [data.id_session, data.id_etudiant, data.infOperation]);
  }

  // 3. getSessionDetail: Retrieve detailed information about a session
  async getSessionDetail(sessionId: number) {
    const query = `SELECT commande_enrollement.*, session.designation, session.montant, session.date_fin, session.date_creation, session.type
                FROM commande_enrollement
                INNER JOIN session ON session.id = commande_enrollement.id_session
                WHERE commande_enrollement.id = ?`;
    return this.executeQuery(query, [sessionId]);
  }

  // 4. orderMacaron: A student orders his/her macaron for the session enrollment
  async orderMacaron(data: { id_commande: number, telephone?: string, orderNumber?: string, ref?: string }) {
    const query = `
      INSERT INTO commande_macaron (id_commande, date_creation, statut, telephone, orderNumber, ref)
      VALUES (?, NOW(), 'OK', ?, ?, ?)
    `;
    return this.executeQuery(query, [
      data.id_commande,
      data.telephone || null,
      data.orderNumber || null,
      data.ref || null
    ]);
  }

  // 5. getSessionDetail: Retrieve detailed information about a session
  async getExamens(sessionId: number) {
    const query = `SELECT examen_matiere.*, matiere.designation, matiere.credit, matiere.code, matiere.code, matiere.semestre, matiere.id_unite, unite.designation AS 'unite', unite.code
                    FROM examen_matiere 
                    INNER JOIN matiere ON matiere.id = examen_matiere.id_matiere
                    INNER JOIN unite ON unite.id = matiere.id_unite
                    WHERE examen_matiere.id_session = ?`;
    return this.executeQuery(query, [sessionId]);
  }
}