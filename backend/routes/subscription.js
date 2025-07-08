const express = require("express");
const Razorpay = require("razorpay");
const User = require("../models/User");
const crypto = require("crypto");
const getRawBody = require("raw-body");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Fetch Razorpay plans
router.get("/plans", async (req, res) => {
  try {
    const plans = await razorpay.plans.all();
    res.json(plans.items);
  } catch (err) {
    console.error(" Error fetching plans:", err);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});

// ✅ Create a new subscription
router.post("/create-subscription", async (req, res) => {
  const { plan_id, userId } = req.body;

  try {
    const sub = await razorpay.subscriptions.create({
      plan_id,
      customer_notify: 1,
      total_count: 12,
    });

    await User.findByIdAndUpdate(userId, {
      subscription: {
        subscriptionId: sub.id,
        planId: plan_id,
        status: sub.status,
        startedAt: new Date(),
      },
    });

    res.status(201).json(sub);
  } catch (err) {
    console.error(" Error creating subscription:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Razorpay Webhook Handler (with raw body)
router.post("/webhook", async (req, res) => {
  const secret = process.env.RZP_WEBHOOK_SECRET;

  try {
    const rawBody = await getRawBody(req); // Capture raw buffer
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn(" Invalid Razorpay signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(rawBody.toString());

    // ✅ Handle subscription event
    if (event.event === "subscription.charged") {
      const sub = event.payload.subscription.entity;

      try {
        await User.findOneAndUpdate(
          { "subscription.subscriptionId": sub.id },
          {
            "subscription.status": sub.status,
            "subscription.endedAt": sub.ended_at ? new Date(sub.ended_at * 1000) : null,
          }
        );
        } catch (err) {
        console.error(" Webhook DB update failed:", err);
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("💥 Webhook error:", err);
    res.status(500).json({ error: "Webhook handling failed" });
  }
});

module.exports = router;
