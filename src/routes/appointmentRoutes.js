const express = require('express');
const {
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment,
} = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Appointment CRUD Routes
router.post('/', authMiddleware, roleMiddleware(['Patient']), createAppointment);
router.get('/', authMiddleware, roleMiddleware(['Doctor', 'Admin', 'Patient']), getAppointments);
router.put('/:id', authMiddleware, roleMiddleware(['Doctor', 'Admin']), updateAppointment);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteAppointment);

module.exports = router;
