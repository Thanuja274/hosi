const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    consultationFee: {
        type: Number,
        required: true
    },
    symptoms: {
        type: String,
        default: ''
    },
    diagnosis: {
        type: String,
        default: ''
    },
    prescription: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Appointment", appointmentSchema);