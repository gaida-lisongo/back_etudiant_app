import { Pool } from 'mysql2/promise';
import Model from './Model';

export default class SectionModel extends Model {
  constructor(db: Pool) {
    super(db);
  }

  // Retrieve section details by sigle
  async getSectionDetail(sigle: string) {
    const query = `SELECT * FROM section WHERE sigle = ?`;
    return this.executeQuery(query, [sigle]);
  }

  // Retrieve all promotions belonging to a section (lookup by sigle)
  async getPromotions(sigle: string) {
    // First retrieve the section id by its sigle
    const querySection = `SELECT id FROM section WHERE sigle = ?`;
    const sectionResult = await this.executeQuery(querySection, [sigle]);
    if (!sectionResult.data || sectionResult.data.length === 0) {
      return { status: 'error', message: 'Section not found' };
    }
    const sectionId = sectionResult.data[0].id;
    const query = `SELECT * FROM promotion WHERE section_id = ?`;
    return this.executeQuery(query, [sectionId]);
  }
}