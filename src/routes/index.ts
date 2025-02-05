import { Router } from 'express';
import sectionRouter from './section';
import enrollementRouter from './enrollment';
import promotionRouter from './promotion';
import userRouter from './user';

const router = Router();

// API version prefix
const API_VERSION = '/api/v1';

router.use(`${API_VERSION}/section`, sectionRouter);
router.use(`${API_VERSION}/enrol`, enrollementRouter);
router.use(`${API_VERSION}/promotion`, promotionRouter);
router.use(`${API_VERSION}/user`, userRouter);

export default router;