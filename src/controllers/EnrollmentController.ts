import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import EnrollmentModel from '../models/EnrollmentModel';
import PromotionController from './PromotionController';

export default class EnrollmentController extends PromotionController {
  private enrollmentModel: EnrollmentModel;

  constructor(db: Pool) {
    super(db);
    this.enrollmentModel = new EnrollmentModel(db);
  }

  // 1. /sessions (GET): List available sessions for a promotion.
  async sessions(req: Request, res: Response) {
    try {
      const { promotionId } = req.params;
      
      if (!promotionId) {
        return this.badRequest(res, 'Promotion ID is required');
      }
      const result = await this.enrollmentModel.getSessions(parseInt(promotionId as string, 10));
      return this.success(res, result.data, 'Sessions retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // 2. /session (POST): Order a session enrollment.
  async orderSession(req: Request, res: Response) {
    try {
      const { id_session, id_etudiant, infOperation } = req.body;
      if (!id_session || !id_etudiant) {
        return this.badRequest(res, 'id_session and id_etudiant are required');
      }
      const result = await this.enrollmentModel.orderSession({ id_session, id_etudiant, infOperation });
      return this.success(res, result.data, 'Session enrollment ordered successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // 3. /session (GET): Retrieve detail of a session.
  async sessionDetail(req: Request, res: Response) {
    try {
      const { cmdId } = req.params;
      if (!cmdId) {
        return this.badRequest(res, 'sessionId is required');
      }
      const result = await this.enrollmentModel.getSessionDetail(parseInt(cmdId as string, 10));
      return this.success(res, result.data, 'Session detail retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // 4. /macaron (POST): Order a macaron for a session enrollment.
  async orderMacaron(req: Request, res: Response) {
    try {
      const { id_commande, telephone, orderNumber, ref } = req.body;
      if (!telephone || !id_commande || !orderNumber) {
        return this.badRequest(res, 'id_etudiant and id_commande are required');
      }
      const result = await this.enrollmentModel.orderMacaron({ id_commande, telephone, orderNumber, ref });
      return this.success(res, result.data, 'Macaron ordered successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // 5. /session (GET): Retrieve detail of a session.
  async examenSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return this.badRequest(res, 'sessionId is required');
      }
      const result = await this.enrollmentModel.getExamens(parseInt(id as string, 10));
      return this.success(res, result.data, 'Session detail retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }
}