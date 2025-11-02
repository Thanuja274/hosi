const express = require('express');
const router = express.Router();

let appointments = [];
let nextId = 1;

// Get all appointments
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: appointments,
        count: appointments.length
    });
});

// Create new appointment
router.post('/', (req, res) => {
    const { patientName, doctorId, date, time, reason } = req.body;

    const newAppointment = {
        id: nextId++,
        patientName,
        doctorId,
        date,
        time,
        reason,
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);

    res.status(201).json({
        success: true,
        data: newAppointment,
        message: 'Appointment created successfully'
    });
});

module.exports = router;