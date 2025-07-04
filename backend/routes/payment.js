const express = require("express");
const Razorpay = require("razorpay");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 🔑 Ensure Razorpay keys are set
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("❌ Razorpay credentials not set in .env");
}

// 🔑 Razorpay Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 📦 Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // INR to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.error("Razorpay order created:", order.id);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ error: "Error creating Razorpay order" });
  }
});

// ✅ Activate Subscription After Payment Success
router.post("/activate-subscription", async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { subscriptionId, planId } = req.body;

    if (!subscriptionId || !planId) {
      return res.status(400).json({ error: "Missing subscription info" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        subscription: {
          status: "active",
          subscriptionId,
          planId,
          startedAt: new Date(),
          endedAt: null, // Optional: set expiry based on planId
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Subscription activated for:", updatedUser.email);

    return res.status(200).json({
      message: "Subscription activated",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
    });
  } catch (err) {
    console.error("Subscription activation error:", err);
    return res.status(500).json({ error: "Subscription activation failed" });
  }
});

module.exports = router;
