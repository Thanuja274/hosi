const express = require('express');
const router = express.Router();

// Sample doctors data
const doctors = [{
        id: 1,
        name: 'Dr. Sarah Wilson',
        specialty: 'Cardiology',
        availability: 'Available',
        experience: '10 years',
        rating: 4.8
    },
    {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Neurology',
        availability: 'Available',
        experience: '8 years',
        rating: 4.7
    },
    {
        id: 3,
        name: 'Dr. Emily Davis',
        specialty: 'Pediatrics',
        availability: 'In Surgery',
        experience: '12 years',
        rating: 4.9
    }
];

// Get all doctors
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: doctors,
        count: doctors.length
    });
});

// Get doctor by ID
router.get('/:id', (req, res) => {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: 'Doctor not found'
        });
    }
    res.json({
        success: true,
        data: doctor
    });
});

module.exports = router;