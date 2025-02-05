import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import SectionModel from '../models/SectionModel';
import Controller from './Controller';

export default class SectionController extends Controller {
  private sectionModel: SectionModel;

  constructor(db: Pool) {
    super(db);
    this.sectionModel = new SectionModel(db);
  }

  async detail(req: Request, res: Response) {
    try {
      const { sigle } = req.query;
      if (!sigle) {
        return this.badRequest(res, 'Sigle is required');
      }
      const result = await this.sectionModel.getSectionDetail(sigle as string);
      return this.success(res, result.data, 'Section detail retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  async promotions(req: Request, res: Response) {
    try {
      const { sigle } = req.query;
      if (!sigle) {
        return this.badRequest(res, 'Sigle is required');
      }
      const result = await this.sectionModel.getPromotions(sigle as string);
      return this.success(res, result.data, 'Promotions retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }
}