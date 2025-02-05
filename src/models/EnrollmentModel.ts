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
    const query = `SELECT * FROM session WHERE id = ?`;
    return this.executeQuery(query, [sessionId]);
  }

  // 4. orderMacaron: A student orders his/her macaron for the session enrollment
  async orderMacaron(data: { id_etudiant: number, id_commande: number, telephone?: string, orderNumber?: string, ref?: string }) {
    const query = `
      INSERT INTO commande_macaron (id_commande, date_creation, statut, telephone, orderNumber, ref)
      VALUES (?, NOW(), 'PENDING', ?, ?, ?)
    `;
    return this.executeQuery(query, [
      data.id_commande,
      data.telephone || null,
      data.orderNumber || null,
      data.ref || null
    ]);
  }

  // 5. getMacaron: Retrieve the macaron for a student’s enrollment
  async getMacaron(id_etudiant: number, id_session: number) {
    const query = `
      SELECT cm.*
      FROM commande_macaron cm
      INNER JOIN commande_enrollement ce ON ce.id = cm.id_commande
      WHERE ce.id_etudiant = ? AND ce.id_session = ? AND cm.statut = 'OK'
    `;
    return this.executeQuery(query, [id_etudiant, id_session]);
  }
}