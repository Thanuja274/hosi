const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No Token." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded; // userId + role + email
        next();
    } catch {
        return res.status(400).json({ message: "Invalid Token" });
    }
}

function roleAccess(allowedRoles) {
    return function(req, res, next) {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied. Not Allowed." });
        }
        next();
    };
}

module.exports = { auth, roleAccess };