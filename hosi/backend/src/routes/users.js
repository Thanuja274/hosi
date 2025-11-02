const express = require('express');
const router = express.Router();

// Sample users data
const users = [{
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Patient',
        joinDate: '2024-01-01'
    },
    {
        id: 2,
        name: 'Admin User',
        email: 'admin@medicare.com',
        role: 'Administrator',
        joinDate: '2024-01-01'
    }
];

// Get all users
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: users,
        count: users.length
    });
});

module.exports = router;