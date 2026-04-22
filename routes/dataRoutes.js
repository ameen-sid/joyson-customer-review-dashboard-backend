import express from 'express';
const router = express.Router();

import {
    addOperatorTraining,
    addTrainingsPlanActual,
    addMsilDefects,
    addInternalRejections,
    addTrainingsPlanActualBottom,
    getDashboardData
} from '../controllers/dataController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

router.use(verifyToken);

router.post('/operator-trainings', addOperatorTraining);
router.post('/trainings-plan-actual', addTrainingsPlanActual);
router.post('/msil-defects', addMsilDefects);
router.post('/internal-rejections', addInternalRejections);
router.post('/trainings-plan-actual-bottom', addTrainingsPlanActualBottom);

router.get('/dashboard-data', getDashboardData);

export default router;