const express = require('express');
const {
    createPatient,
    getPatients,
    updatePatient,
    deletePatient,
} = require('../controllers/patientController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Patient CRUD Routes
router.post('/', authMiddleware, roleMiddleware(['Doctor', 'Admin']), createPatient);
router.get('/', authMiddleware, roleMiddleware(['Doctor', 'Admin', 'Patient']), getPatients);
router.put('/:id', authMiddleware, roleMiddleware(['Doctor', 'Admin']), updatePatient);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deletePatient);

module.exports = router;