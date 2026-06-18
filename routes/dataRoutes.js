import express from 'express';
const router = express.Router();

import {
    addOperatorTraining,
    updateOperatorTraining,
    deleteOperatorTraining,
    addTrainingsPlanActual,
    updateTrainingsPlanActual,
    deleteTrainingsPlanActual,
    addMsilDefects,
    updateMsilDefects,
    deleteMsilDefects,
    addInternalRejections,
    updateInternalRejections,
    deleteInternalRejections,
    addTrainingsPlanActualBottom,
    updateTrainingsPlanActualBottom,
    deleteTrainingsPlanActualBottom,
    getDashboardData
} from '../controllers/dataController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

router.use(verifyToken);

// Operator Trainings routes
router.post('/operator-trainings', addOperatorTraining);
router.put('/operator-trainings/:id', updateOperatorTraining);
router.delete('/operator-trainings/:id', deleteOperatorTraining);

// Trainings Plan vs Actual (Regular) routes
router.post('/trainings-plan-actual', addTrainingsPlanActual);
router.put('/trainings-plan-actual/:id', updateTrainingsPlanActual);
router.delete('/trainings-plan-actual/:id', deleteTrainingsPlanActual);

// MSIL Defects routes
router.post('/msil-defects', addMsilDefects);
router.put('/msil-defects/:id', updateMsilDefects);
router.delete('/msil-defects/:id', deleteMsilDefects);

// Internal Rejections routes
router.post('/internal-rejections', addInternalRejections);
router.put('/internal-rejections/:id', updateInternalRejections);
router.delete('/internal-rejections/:id', deleteInternalRejections);

// Trainings Plan vs Actual (Bottom) routes
router.post('/trainings-plan-actual-bottom', addTrainingsPlanActualBottom);
router.put('/trainings-plan-actual-bottom/:id', updateTrainingsPlanActualBottom);
router.delete('/trainings-plan-actual-bottom/:id', deleteTrainingsPlanActualBottom);

router.get('/dashboard-data', getDashboardData);

export default router;