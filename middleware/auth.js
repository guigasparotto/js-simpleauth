const jwt = require("jsonwebtoken");
const config = require("config");

// This middleware will be called every time one of the endpoints are hit
// The next parameter in middleware functions indicates that it should
// call the next function in the chain once it is done

module.exports = function (req, res, next) {
    // Get token from the header
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({ msg: "Token not found. Authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        req.user = decoded.user;
        next();
    } catch (err) {
        req.status(401).json({ msg: "Invalid token" });
    }
};
