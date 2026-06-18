import db from '../database/db.js';

export const addOperatorTraining = async (req, res) => {
    try {
        const { monthYear, planJoined, operatorTrained } = req.body;
        if (!monthYear || !planJoined || !operatorTrained) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        await db.query('INSERT INTO operator_trainings (month_year, plan_joined, operator_trained) VALUES (?, ?, ?)', [monthYear, parseInt(planJoined), parseInt(operatorTrained)]);
        res.json({
            success: true,
            message: 'Data added successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const addTrainingsPlanActual = async (req, res) => {
    try {
        const { monthYear, trainingPlanRegular, actual } = req.body;
        if (!monthYear || !trainingPlanRegular || !actual) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        await db.query('INSERT INTO trainings_plan_actual (month_year, training_plan_regular, actual) VALUES (?, ?, ?)', [monthYear, parseInt(trainingPlanRegular), parseInt(actual)]);
        res.json({
            success: true,
            message: 'Data added successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const addMsilDefects = async (req, res) => {
    try {
        const { monthYear, overallDefectCustomer, ctqDefectCustomer } = req.body;
        if (!monthYear || !overallDefectCustomer || !ctqDefectCustomer) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        await db.query('INSERT INTO msil_defects (month_year, overall_defect_customer, ctq_defect_customer) VALUES (?, ?, ?)', [monthYear, parseInt(overallDefectCustomer), parseInt(ctqDefectCustomer)]);
        res.json({
            success: true,
            message: 'Data added successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const addInternalRejections = async (req, res) => {
    try {
        const { monthYear, overallDefectInternal, ctqDefectInternal } = req.body;
        if (!monthYear || !overallDefectInternal || !ctqDefectInternal) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        await db.query('INSERT INTO internal_rejections (month_year, overall_defect_internal, ctq_defect_internal) VALUES (?, ?, ?)', [monthYear, parseInt(overallDefectInternal), parseInt(ctqDefectInternal)]);
        res.json({
            success: true,
            message: 'Data added successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const addTrainingsPlanActualBottom = async (req, res) => {
    try {
        const { monthYear, trainingPlan, trainingDone } = req.body;
        if (!monthYear || !trainingPlan || !trainingDone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        await db.query('INSERT INTO trainings_plan_actual_bottom (month_year, training_plan, training_done) VALUES (?, ?, ?)', [monthYear, parseInt(trainingPlan), parseInt(trainingDone)]);
        res.json({
            success: true,
            message: 'Data added successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getDashboardData = async (req, res) => {
    try {
        const [operatorTrainings] = await db.query('SELECT * FROM operator_trainings ORDER BY id ASC');
        const [trainingsPlanActual] = await db.query('SELECT * FROM trainings_plan_actual ORDER BY id ASC');
        const [msilDefects] = await db.query('SELECT * FROM msil_defects ORDER BY id ASC');
        const [internalRejections] = await db.query('SELECT * FROM internal_rejections ORDER BY id ASC');
        const [trainingsPlanActualBottom] = await db.query('SELECT * FROM trainings_plan_actual_bottom ORDER BY id ASC');

        const currentYearFull = new Date().getFullYear().toString();
        const currentYearShort = currentYearFull.slice(-2);

        const isCurrentYear = (monthStr) => {
            if (!monthStr) return false;
            const str = monthStr.trim();
            return str.endsWith(`-${currentYearShort}`) || str.endsWith(` ${currentYearShort}`) || 
                   str.endsWith(`-${currentYearFull}`) || str.endsWith(` ${currentYearFull}`) ||
                   str === currentYearShort || str === currentYearFull;
        };

        const sumField = (arr, field) => arr
            .filter(row => isCurrentYear(row.month_year))
            .reduce((sum, item) => sum + (Number(item[field]) || 0), 0);

        const summary = {
            newOperatorsJoined: sumField(operatorTrainings, 'plan_joined'),
            newOperatorTrained: sumField(operatorTrainings, 'operator_trained'),
            
            totalTrainingsPlan: sumField(trainingsPlanActual, 'training_plan_regular'),
            totalTrainingAct: sumField(trainingsPlanActual, 'actual'),
            
            totalDefectsMsil: sumField(msilDefects, 'overall_defect_customer'),
            ctqDefectsMsil: sumField(msilDefects, 'ctq_defect_customer'),
            
            totalInternalRejection: sumField(internalRejections, 'overall_defect_internal'),
            ctqInternalRejection: sumField(internalRejections, 'ctq_defect_internal')
        };

        res.json({
            success: true,
            graphs: {
                operatorTrainings,
                trainingsPlanActual,
                msilDefects,
                internalRejections,
                trainingsPlanActualBottom
            },
            summary
        });
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        res.status(500).json({ success: false, message: 'Server error fetching dashboard data' });
    }
};

// Update and Delete Controllers for Operator Trainings
export const updateOperatorTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const { monthYear, planJoined, operatorTrained } = req.body;
        if (!monthYear || planJoined === undefined || operatorTrained === undefined) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        await db.query(
            'UPDATE operator_trainings SET month_year = ?, plan_joined = ?, operator_trained = ? WHERE id = ?',
            [monthYear, parseInt(planJoined), parseInt(operatorTrained), id]
        );
        res.json({ success: true, message: 'Data updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteOperatorTraining = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM operator_trainings WHERE id = ?', [id]);
        res.json({ success: true, message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update and Delete Controllers for Trainings Plan vs Actual (Regular)
export const updateTrainingsPlanActual = async (req, res) => {
    try {
        const { id } = req.params;
        const { monthYear, trainingPlanRegular, actual } = req.body;
        if (!monthYear || trainingPlanRegular === undefined || actual === undefined) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        await db.query(
            'UPDATE trainings_plan_actual SET month_year = ?, training_plan_regular = ?, actual = ? WHERE id = ?',
            [monthYear, parseInt(trainingPlanRegular), parseInt(actual), id]
        );
        res.json({ success: true, message: 'Data updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteTrainingsPlanActual = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM trainings_plan_actual WHERE id = ?', [id]);
        res.json({ success: true, message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update and Delete Controllers for MSIL Defects
export const updateMsilDefects = async (req, res) => {
    try {
        const { id } = req.params;
        const { monthYear, overallDefectCustomer, ctqDefectCustomer } = req.body;
        if (!monthYear || overallDefectCustomer === undefined || ctqDefectCustomer === undefined) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        await db.query(
            'UPDATE msil_defects SET month_year = ?, overall_defect_customer = ?, ctq_defect_customer = ? WHERE id = ?',
            [monthYear, parseInt(overallDefectCustomer), parseInt(ctqDefectCustomer), id]
        );
        res.json({ success: true, message: 'Data updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteMsilDefects = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM msil_defects WHERE id = ?', [id]);
        res.json({ success: true, message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update and Delete Controllers for Internal Rejections
export const updateInternalRejections = async (req, res) => {
    try {
        const { id } = req.params;
        const { monthYear, overallDefectInternal, ctqDefectInternal } = req.body;
        if (!monthYear || overallDefectInternal === undefined || ctqDefectInternal === undefined) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        await db.query(
            'UPDATE internal_rejections SET month_year = ?, overall_defect_internal = ?, ctq_defect_internal = ? WHERE id = ?',
            [monthYear, parseInt(overallDefectInternal), parseInt(ctqDefectInternal), id]
        );
        res.json({ success: true, message: 'Data updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteInternalRejections = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM internal_rejections WHERE id = ?', [id]);
        res.json({ success: true, message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update and Delete Controllers for Trainings Plan vs Actual (Bottom)
export const updateTrainingsPlanActualBottom = async (req, res) => {
    try {
        const { id } = req.params;
        const { monthYear, trainingPlan, trainingDone } = req.body;
        if (!monthYear || trainingPlan === undefined || trainingDone === undefined) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        await db.query(
            'UPDATE trainings_plan_actual_bottom SET month_year = ?, training_plan = ?, training_done = ? WHERE id = ?',
            [monthYear, parseInt(trainingPlan), parseInt(trainingDone), id]
        );
        res.json({ success: true, message: 'Data updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteTrainingsPlanActualBottom = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM trainings_plan_actual_bottom WHERE id = ?', [id]);
        res.json({ success: true, message: 'Data deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};