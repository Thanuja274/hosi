const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    userType: {
        type: String,
        enum: ["patient", "doctor", "staff", "admin"],
        default: "patient",
    },
    phone: {
        type: String,
        default: ""
    },
    specialization: {
        type: String,
        default: ""
    },
    experience: {
        type: Number,
        default: 0
    },
    licenseNumber: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Hash password before saving - FIXED VERSION
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);