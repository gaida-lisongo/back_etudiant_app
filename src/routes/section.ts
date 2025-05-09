import { Router, Request, Response } from 'express';
import SectionController from '../controllers/SectionController';
import pool from '../config/database';

const router = Router();
const sectionController = new SectionController();


// GET /?sigle=... : Retrieve the detail of a section by its sigle
router.get('/:sigle', (req: Request, res: Response) => sectionController.detail(req, res));

// GET /promotions?sigle=... : Retrieve all promotions of a section by its sigle
router.get('/promotions/:sectionId', (req: Request, res: Response) => sectionController.promotions(req, res));

export default router;