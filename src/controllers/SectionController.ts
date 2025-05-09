import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import SectionModel from '../models/SectionModel';
import Controller from './Controller';

export default class SectionController extends Controller {
  private sectionModel: SectionModel;

  constructor() {
    super();
    this.sectionModel = new SectionModel();
  }

  async detail(req: Request, res: Response) {
    try {
      const { sigle } = req.params;

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
      const { sectionId } = req.params;
      if (!sectionId) {
        return this.badRequest(res, 'section ID is required');
      }
      const result = await this.sectionModel.getPromotions(parseInt(sectionId, 10));
      return this.success(res, result.data, 'Promotions retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }
}