// backend/models/Staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    position: { type: String, required: true },
    department: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },

    salary: { type: Number, required: true },
    hireDate: { type: Date, required: true },

    permissions: [{
        type: String,
        enum: [
            'view_patients', 'manage_patients',
            'view_doctors', 'manage_doctors',
            'view_appointments', 'manage_appointments',
            'view_pharmacy', 'manage_pharmacy',
            'view_reports', 'manage_reports',
            'manage_staff'
        ]
    }],

    // ✅ Fix: role must be inside schema
    role: {
        type: String,
        default: "staff"
    }

}, { timestamps: true });

staffSchema.index({ userId: 1 });

module.exports = mongoose.model('Staff', staffSchema);