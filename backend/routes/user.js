// backend/routes/user.js

const express = require("express");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// ✅ GET /api/user/me/subscription — Protected Route
router.get("/me/subscription", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ subscription: user.subscription });
  } catch (err) {
    console.error("💥 Subscription fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
