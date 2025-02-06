import { Pool } from 'mysql2/promise';
import Model from './Model';

export default class SectionModel extends Model {
  constructor(db: Pool) {
    super(db);
  }

  // Retrieve section details by sigle
  async getSectionDetail(sigle: string) {
    const query = `SELECT * FROM section WHERE sigle = ?`;

    const result = await this.executeQuery(query, [sigle]);
    return result;
  }

  // Retrieve all promotions belonging to a section (lookup by sigle)
  async getPromotions(sectionId: number) {
    
    const query = `SELECT promotion.*, niveau.intitule, niveau.systeme, cycle.designation AS 'cycle'
                    FROM promotion 
                    INNER JOIN niveau ON niveau.id = promotion.id_niveau
                    INNER JOIN cycle ON cycle.id = niveau.id_cycle
                    WHERE id_section = ?`;
    const result = await this.executeQuery(query, [sectionId]);
    return result;
  }
  
}