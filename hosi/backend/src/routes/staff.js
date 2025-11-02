const express = require("express");
const router = express.Router();
const { auth, roleAccess } = require("../middleware/authMiddleware");
const { authenticateToken, staffOnly } = require("../middleware/auth");


// Staff can access these
router.get("/dashboard", auth, roleAccess(["staff", "admin"]), (req, res) => {
    res.json({ message: "Staff dashboard access granted" });
});

// Example: staff can view patients
router.get("/patients", auth, roleAccess(["staff", "admin"]), (req, res) => {
    res.json({ message: "Staff can view patient list" });
});

router.get("/dashboard", authenticateToken, staffOnly, (req, res) => {
    res.json({ message: "Staff Dashboard" });
});

module.exports = router;