const jwt = require("jsonwebtoken");
// ✅ Verify token exists & valid
const authenticateToken = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET || "medicare_secret_key_2024", (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        req.user = user;
        next();
    });
};

// ✅ Role Middleware
const patientOnly = (req, res, next) => {
    if (req.user.userType !== "patient") return res.status(403).json({ message: "Patients only" });
    next();
};

const doctorOnly = (req, res, next) => {
    if (req.user.userType !== "doctor" && req.user.userType !== "admin")
        return res.status(403).json({ message: "Doctors only" });
    next();
};

const staffOnly = (req, res, next) => {
    if (req.user.userType !== "staff" && req.user.userType !== "admin")
        return res.status(403).json({ message: "Staff only" });
    next();
};

module.exports = { authenticateToken, patientOnly, doctorOnly, staffOnly };