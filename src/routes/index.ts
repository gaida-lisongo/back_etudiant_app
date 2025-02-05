import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import sectionRouter from './section';
import enrollementRouter from './enrollment';
import promotionRouter from './promotion';
import userRouter from './user';

const router = Router();

// API version prefix
const API_VERSION = '/api/v1';

// Public routes: section and user endpoints are unprotected
router.use(`${API_VERSION}/section`, sectionRouter);
router.use(`${API_VERSION}/user`, userRouter);

// Protected routes: enrollement and promotion endpoints require authentication
router.use(`${API_VERSION}/enrol`, authenticate, enrollementRouter);
router.use(`${API_VERSION}/promotion`, authenticate, promotionRouter);

export default router;