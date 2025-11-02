const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    // Link to User account
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // Medical Info
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: 0,
        max: 120
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Gender is required']
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
    },

    // Medical History
    medicalHistory: [{
        condition: String,
        diagnosedDate: Date,
        status: {
            type: String,
            enum: ['Active', 'Resolved', 'Chronic']
        },
        notes: String
    }],

    // Allergies
    allergies: [{
        allergen: String,
        severity: {
            type: String,
            enum: ['Mild', 'Moderate', 'Severe']
        },
        reaction: String
    }],

    // Emergency Contact
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
        address: String
    },

    // Insurance Info
    insurance: {
        provider: String,
        policyNumber: String,
        groupNumber: String,
        validUntil: Date
    },

    // Additional Info
    occupation: String,
    maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed']
    }
}, {
    timestamps: true
});

// Create index for faster queries
patientSchema.index({ userId: 1 });

module.exports = mongoose.model('Patient', patientSchema);