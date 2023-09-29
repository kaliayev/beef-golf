const jwt = require("jsonwebtoken");
const {parsed: config } = require("dotenv").config();
const log = require('../logging/log');
const authMiddleware = (req, res, next) => {
    let authToken = req.get("Authorization")
    if (authToken) {
        authToken = authToken.slice(7);
        try {
            let verified = jwt.verify(authToken, config.JWT_SECRET);
            next();
        } catch (e) {
            log.error(e);
            return res.status(401).json({error: e.message || "Unauthorized"});
        }
    } else {
        return res.status(401).json({error: "Missing Authorization header"});
    }
}

module.exports = authMiddleware;