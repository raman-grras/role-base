const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    try {
        let authHeader = req.headers.authorization;
        // console.log(authHeader.split(" ")[1],"authHeaders")
        if (authHeader) {
            const token = authHeader.split(" ")[1]
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
            if (!decodeToken) {
                return res.status(401).json({ success: false, error: "token expired" })
            }
            req.user = decodeToken; // Attach user info including role to req
            return next()
        }
        res.status(401).json({ message: "token is not provided" })
    } catch (error) {
        console.error("Error:", error);
        return res.status(401).json({ success: false, error: error });
    }
}

// Middleware to check if user has required role(s)
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: "Access denied: No role found" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: Insufficient permissions" });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole }
