const express = require("express");
const router = express.Router();

// ✅ Import Middlewares
const auth = require("../middleware/auth");
const roleAccess = require("../middleware/roleAccess");

// ✅ Import Patient Model
const Patient = require("../models/Patient");

// ✅ Create / Add Patient
router.post("/", async(req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json({ message: "Patient added successfully", patient });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ Get My Profile (Protected)
router.get(
    "/my-profile",
    auth,
    roleAccess(["patient", "doctor", "staff", "admin"]),
    async(req, res) => {
        try {
            const patient = await Patient.findOne({ userId: req.user.userId });
            if (!patient) {
                return res.status(404).json({ message: "Patient data not found" });
            }
            res.json({ success: true, patient });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;