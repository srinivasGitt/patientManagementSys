const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Create an appointment (Patient only)
exports.createAppointment = async (req, res) => {
    try {

        if (req.user.role !== 'Patient') {
            return res.status(403).json({ message: "Only patients can book appointments" });
        }

        const { doctor, date, time, notes } = req.body;

        const appointedDoctor = await User.findById(doctor);
        if (!appointedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        if (appointedDoctor.role !== 'Doctor') {
            return res.status(400).json({ message: "Assigned user is not a doctor" });
        }

        const appointment = new Appointment({
            patient: req.user.id,
            doctor,
            date,
            time,
            notes,
        });

        await appointment.save();
        res.status(201).json(appointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get appointments (Restricted by role)
exports.getAppointments = async (req, res) => {
    try {
        const { role, id } = req.user;

        let appointments;

        if (role === 'Admin') {
            appointments = await Appointment.find()
                .populate('patient', 'name email')
                .populate('doctor', 'name email');
        } else if (role === 'Doctor') {
            appointments = await Appointment.find({ doctor: id })
                .populate('patient', 'name email')
                .populate('doctor', 'name email');
        } else if (role === 'Patient') {
            appointments = await Appointment.find({ patient: id })
                .populate('doctor', 'name email');
        } else {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an appointment (Doctor/Admin only)
exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id);

        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        if (req.user.role === 'Doctor' && appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this appointment" });
        }

        Object.assign(appointment, req.body);
        await appointment.save();

        res.status(200).json(appointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an appointment (Admin only)
exports.deleteAppointment = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Only admins can delete appointments" });
        }

        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
