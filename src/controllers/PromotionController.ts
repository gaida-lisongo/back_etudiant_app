import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import PromotionModel from '../models/PromotionModel';
import UserController from './UserController';

interface AnneeResponse {
  status: string;
  message: string;
  data: Array<{
    id: number;
    debut: string;
    fin: string;
  }>;
}
export default class PromotionController extends UserController {
  private promotionModel: PromotionModel;

  constructor() {
    super();
    this.promotionModel = new PromotionModel();
  }

  // 1. presence: Enroll a student in lecon_presence table
  async presence(req: Request, res: Response) {
    try {
      const { id_etudiant, date_inscription, statut, id_lecon, coords } = req.body;
      if (!id_etudiant || !date_inscription || !statut || !id_lecon) {
        return this.badRequest(res, 'Missing required fields');
      }
      const result = await this.promotionModel.presence({ id_etudiant, date_inscription, statut, id_lecon, coords });
      return this.success(res, result.data, 'Presence recorded successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // 2. cours: Retrieve all courses related to a promotion
  async cours(req: Request, res: Response) {
    try {
      const { promotionId } = req.params;
      if (!promotionId) {
        return this.badRequest(res, 'Promotion ID is required');
      }
      const result = await this.promotionModel.getCourses(parseInt(promotionId, 10));
      return this.success(res, result.data, 'Courses retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // 3. travaux: Retrieve all travaux linked to a course
  async travaux(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      if (!courseId) {
        return this.badRequest(res, 'Course ID is required');
      }
      const result = await this.promotionModel.getTravaux(parseInt(courseId, 10));
      return this.success(res, result.data, 'Travaux retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // 4. lecon: Retrieve lesson info and its content (e.g., PDF, Excel, images)
  async lecon(req: Request, res: Response) {
    try {
      const { leconId } = req.params;
      if (!leconId) {
        return this.badRequest(res, 'Lecon ID is required');
      }
      const result = await this.promotionModel.getLecon(parseInt(leconId, 10));
      return this.success(res, result.data, 'Lecon retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // 5. travail: Allow a student to order a travail (commande_travail)
  async travail(req: Request, res: Response) {
    try {
      const { id_etudiant, id_travail, id_annee, additionalInfo } = req.body;
      if (!id_etudiant || !id_travail || !id_annee) {
        return this.badRequest(res, 'Missing required fields');
      }
      const result = await this.promotionModel.orderTravail({ id_etudiant, id_travail, id_annee, additionalInfo });
      return this.success(res, result.data, 'Travail ordered successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // 6. detail_travail: Retrieve detailed information about a travail
  async detail_travail(req: Request, res: Response) {
    try {
      const { cmdId } = req.params;
      if (!cmdId) {
        return this.badRequest(res, 'Travail ID is required');
      }
      const result = await this.promotionModel.getDetailTravail(parseInt(cmdId, 10));
      return this.success(res, result.data, 'Detail travail retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // New method: listPresence - lists all students present in a lesson
  async listPresence(req: Request, res: Response) {
    try {
      const { leconId } = req.params;
      if (!leconId) {
        return this.badRequest(res, 'Lecon ID is required');
      }
      const result = await this.promotionModel.listePresence(parseInt(leconId, 10));
      return this.success(res, result.data, 'List of presences retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }
  // New method: fiches – Liste toutes les fiches de validation
  async fiches(req: Request, res: Response) {
    try {
      const result = await this.promotionModel.getFiches();
      return this.success(res, result.data, 'Fiches retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // New method: fiche – Commander une fiche de validation
  async fiche(req: Request, res: Response) {
    try {
      const { id_validation, id_etudiant, additionalInfo } = req.body;
      if (!id_validation || !id_etudiant) {
        return this.badRequest(res, 'id_validation and id_etudiant are required');
      }
      const result = await this.promotionModel.orderFiche({ id_validation, id_etudiant, additionalInfo });
      return this.success(res, result.data, 'Fiche ordered successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // New method: detailFiche – Récupérer le détail d'une commande de fiche
  async detailFiche(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return this.badRequest(res, 'Fiche ID is required');
      }
      const result = await this.promotionModel.getDetailFiche(parseInt(id, 10));
      return this.success(res, result.data, 'Fiche detail retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // New method: detailFiche – Récupérer le détail d'une commande de fiche
  async detailEnrol(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return this.badRequest(res, 'Fiche ID is required');
      }
      const result = await this.promotionModel.getDetailEnrol(parseInt(id));
      console.log("Commande Session : ", parseInt(id, 10), " resultat data", result);
      return this.success(res, result.data, 'Fiche detail retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  // New method: detailCoteStudiant - Récupérer le détail d'une cote d'un étudiant


  async detailCoteEtudiant(req: Request, res: Response) {
    try {
      const { id_matiere, id_etudiant } = req.body;
      const annee = await this.promotionModel.getThisAnnee() as AnneeResponse;
      const id_annee = annee.data[0].id;
      
      if (!id_matiere || !id_etudiant || !id_annee) {
        return this.badRequest(res, 'id_matiere, id_etudiant and id_annee are required');
      }
      
      const result = await this.promotionModel.getDetailCote(id_matiere, id_etudiant, id_annee);
      return this.success(res, result.data, 'Cote detail retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }
}