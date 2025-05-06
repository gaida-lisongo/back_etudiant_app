import { Pool } from 'mysql2/promise';
import UserModel from './UserModel';

export default class PromotionModel extends UserModel {
  constructor(db: Pool) {
    super(db);
  }

  // 1. presence: Enregistrer la présence d'un étudiant dans leçon_presence
  async presence(data: { id_etudiant: number, date_inscription: string, statut: string, id_lecon: number, coords?: string }) {
    const query = `
      INSERT INTO lecon_presence (id_etudiant, date_inscription, statut, id_lecon, coords)
      VALUES (?, ?, ?, ?, ?)
    `;
    return this.executeQuery(query, [
      data.id_etudiant,
      data.date_inscription,
      data.statut,
      data.id_lecon,
      data.coords || null
    ]);
  }

  // Méthode listePrésence: Liste tous les étudiants présents à une leçon
  async listePresence(leconId: number) {
    const query = `SELECT lecon_presence.*, etudiant.avatar, etudiant.nom, etudiant.post_nom, etudiant.prenom, etudiant.matricule
      FROM lecon_presence
      INNER JOIN etudiant ON etudiant.id = lecon_presence.id_etudiant
      WHERE id_lecon = ?
    `;
    return this.executeQuery(query, [leconId]);
  }

  // 2. cours: Récupérer tous les cours liés à une promotion
  async getCourses(promotionId: number) {
    const query = `SELECT matiere.*, unite.designation AS 'unite', unite.code AS 'code_unite'
            FROM matiere 
            INNER JOIN unite ON unite.id = matiere.id_unite
            WHERE unite.id_promotion = ?`;
    return this.executeQuery(query, [promotionId]);
  }
  // 2. cours: Récupérer tous les cours liés à une promotion
  async getCours(matiereId: number) {
    const query = `SELECT matiere.*, unite.designation AS 'unite', unite.code AS 'code_unite'
            FROM matiere 
            INNER JOIN unite ON unite.id = matiere.id_unite
            WHERE unite.id_promotion = ?`;
    return this.executeQuery(query, [matiereId]);
  }

  async getChargeHoraire(matiereId: number, anneeId: number) {
    const query = `SELECT matiere.*, unite.designation AS 'unite', unite.code AS 'code_unite', CONCAT(agent.nom, " ", agent.post_nom, " ", " (Matricule : ", agent.matricule) As titulaire, agent.telephone AS phone 
            FROM matiere 
            INNER JOIN unite ON unite.id = matiere.id_unite
            INNER JOIN charge_horaire chg ON chg.id_matiere = matiere.id
            INNER JOIN agent ON agent.id = chg.id_titulaire
            WHERE matiere.id = ? AND chg.id_annee = ?`;
    return this.executeQuery(query, [matiereId, anneeId]);
  }

  // 3. travaux: Récupérer tous les travaux liés à un cours
  async getTravaux(courseId: number) {
    const query = `SELECT *, CONCAT('', '3') AS 'id_annee'
                FROM travail
                WHERE travail.id_matiere = ?`;
    return this.executeQuery(query, [courseId]);
  }

  // 4. lecon: Récupérer les informations d'une leçon ainsi que son contenu (ex. PDF, Excel, image)
  async getLecon(leconId: number) {
    const query = `
      SELECT l.*, lc.designation, lc.credit, lc.semestre, u.designation AS 'unite', u.code
      FROM lecon l
      INNER JOIN matiere lc ON l.id_matiere = lc.id
      INNER JOIN unite u ON u.id = lc.id_unite
      WHERE l.id = ?
    `;
    return this.executeQuery(query, [leconId]);
  }

  // 5. travail: Permettre à un étudiant de commander un travail (insertion dans commande_travail)
  async orderTravail(data: { id_etudiant: number, id_travail: number, id_annee : number, additionalInfo?: string }) {
    const query = `
      INSERT INTO commande_travail (
        id_travail, 
        id_etudiant, 
        date_creation, 
        statut, 
        id_agent, 
        id_annee, 
        ref, 
        payment
      ) VALUES (?, ?, NOW(), 'OK', 20, ?, ?, 'MOBILE MONEY')
    `;
    const ref = data.additionalInfo || '';
    return this.executeQuery(query, [data.id_travail, data.id_etudiant, data.id_annee, ref]);
  }

  // 6. detail_travail: Obtenir plus d'information sur un travail
  async getDetailTravail(travailId: number) {
    const query = `SELECT ct.*, t.date_creation, t.titre, t.description, t.date_fin, t.type, t.max, t.prix, CONCAT('question_', t.id, '.pdf') AS url
      FROM commande_travail ct
      LEFT JOIN travail t ON ct.id_travail = t.id
      WHERE ct.id = ?
    `;
    return this.executeQuery(query, [travailId]);
  }

  // 7. getFiches: Liste toutes les fiches de validation de la promotion
  async getFiches() {
    const query = `SELECT fiche.*, section.sigle, niveau.intitule AS 'niveau', niveau.systeme, promotion.orientation, promotion.description
                  FROM fiche_validation fiche
                  INNER JOIN promotion ON promotion.id = fiche.id_promotion
                  INNER JOIN section ON section.id = promotion.id_section
                  INNER JOIN niveau ON niveau.id = promotion.id_niveau`;
    return this.executeQuery(query, []);
  }

  // 8. orderFiche: Commander une fiche de validation
  async orderFiche(data: { id_validation: number, id_etudiant: number, additionalInfo?: string }) {
    const query = `
      INSERT INTO commande_validation (id_validation, id_etudiant, statut, date_creation, transaction, id_caissier, payment)
      VALUES (?, ?, 'OK', NOW(), ?, 20, 'MOBILE MONEY')
    `;
    return this.executeQuery(query, [data.id_validation, data.id_etudiant, data.additionalInfo || '']);
  }

  // 9. getDetailFiche: Récupérer le détail d'une commande de fiche
  async getDetailFiche(ficheId: number) {
    const query = `
      SELECT cv.*, etudiant.nom, etudiant.post_nom, etudiant.matricule 
      FROM commande_validation cv
      INNER JOIN etudiant ON etudiant.id = cv.id_etudiant
      WHERE cv.id = ?
    `;
    return this.executeQuery(query, [ficheId]);
  }
  // 7. getFiches: Liste toutes les fiches de validation de la promotion
  async getFiche(ficheId: number) {
    const query = `SELECT fiche.*, section.sigle, niveau.intitule AS 'niveau', niveau.systeme, promotion.orientation, promotion.description
                  FROM fiche_validation fiche
                  INNER JOIN promotion ON promotion.id = fiche.id_promotion
                  INNER JOIN section ON section.id = promotion.id_section
                  INNER JOIN niveau ON niveau.id = promotion.id_niveau
                  WHERE fiche.id = ?`;
    return this.executeQuery(query, [ficheId]);
  }

  async getDetailEnrol(enrolId: number) {
    const query = `
      SELECT ce.*, etudiant.nom, etudiant.post_nom, etudiant.matricule
      FROM commande_enrollement ce
      INNER JOIN etudiant ON etudiant.id = ce.id_etudiant
      WHERE ce.id = ?
    `;
    return this.executeQuery(query, [enrolId]);
  }

  async getThisAnnee() {
    const query = `SELECT * FROM annee ORDER BY annee.id DESC LIMIT 1`;
    
    return this.executeQuery(query, []);
  }

  async getDetailCote(id_matiere: number, id_etudiant: number, id_annee: number) {
    const query = `
      SELECT f.*, m.designation AS 'matiere', m.code AS 'code_matiere', m.credit, m.semestre
      FROM fiche_cotation f
      INNER JOIN matiere m ON m.id = f.id_matiere
      WHERE f.id_matiere = ? AND f.id_etudiant = ? AND f.id_annee = ?
    `;
    return this.executeQuery(query, [id_matiere, id_etudiant, id_annee]);
  }

  // 10. getPromotionById: Récupérer les informations d'une promotion
  async getPromotionById(promotionId: number) {
    
    const query = `SELECT promotion.*, niveau.intitule, niveau.systeme, cycle.designation AS 'cycle'
                    FROM promotion 
                    INNER JOIN niveau ON niveau.id = promotion.id_niveau
                    INNER JOIN cycle ON cycle.id = niveau.id_cycle
                    WHERE promotion.id = ?`;
    const result = await this.executeQuery(query, [promotionId]);
    return result;
  }
  
}