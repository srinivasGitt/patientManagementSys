const Patient = require('../models/Patient');
const User = require('../models/User');


exports.createPatient = async (req, res) => {
    try {
        const { role } = req.user;

        // Restrict patient creation to Admin and Doctor only
        if (role !== 'Admin' && role !== 'Doctor') {
            return res.status(403).json({ message: "Forbidden: You do not have permission to create a patient." });
        }

        const { name, age, medicalHistory, assignedDoctor } = req.body;

        const doctor = await User.findById(assignedDoctor);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        if (doctor.role !== 'Doctor') {
            return res.status(400).json({ message: "Assigned user is not a doctor" });
        }

        const patient = new Patient({
            name,
            age,
            medicalHistory,
            assignedDoctor,
            createdBy: req.user.id,
        });
        await patient.save();
        res.status(201).json(patient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



exports.getPatients = async (req, res) => {
    try {
        const { role, id } = req.user;

        let patients;

        if (role === 'Admin') {
            // Admin can access all patients
            patients = await Patient.find().populate('assignedDoctor', 'name email');
        } else if (role === 'Doctor') {
            // Doctor can only access assigned patients
            patients = await Patient.find({ assignedDoctor: id }).populate('assignedDoctor', 'name email');
        } else if (role === 'Patient') {
            // Patient can only access their own records
            patients = await Patient.find({ createdBy: id });
        } else {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.user;

        const patient = await Patient.findById(id);

        if (!patient) return res.status(404).json({ message: "Patient not found" });

        // Doctors can only update their assigned patients
        if (role === 'Doctor' && patient.assignedDoctor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this record" });
        }

        // Update only the provided fields
        Object.assign(patient, req.body);
        await patient.save();

        res.status(200).json(patient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.deletePatient = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Only admins can delete records" });
        }

        const patient = await Patient.findByIdAndDelete(id);

        if (!patient) return res.status(404).json({ message: "Patient not found" });

        res.status(200).json({ message: "Patient record deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


