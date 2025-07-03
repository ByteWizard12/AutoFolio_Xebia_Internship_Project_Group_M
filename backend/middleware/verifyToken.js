// backend/middleware/verifyToken.js

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // Extract token from headers (supporting both custom and Bearer format)
    const token =
      req.headers.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request object for downstream use
    req.userId = decoded.userId;

    next(); // Proceed to next middleware or route
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
