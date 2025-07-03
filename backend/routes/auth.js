const express = require('express');
const { z } = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ✅ Registration Schema
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// ✅ Login Schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// 📩 REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    console.log("📩 Register request received:", req.body);

    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log("❌ Validation error:", parsed.error.errors);
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    }

    const { name, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      subscription: {
        status: 'inactive',
      },
    });

    await newUser.save();
    console.log("✅ User created:", email);

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        subscription: newUser.subscription?.status || 'inactive',
        isActive: false,
      },
    });
  } catch (err) {
    console.error("🔥 Registration error:", err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 🔐 LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    console.log("🔐 Login request received:", req.body);

    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log("❌ Validation error:", parsed.error.errors);
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("❌ Incorrect password for:", email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const subscriptionStatus = user.subscription?.status || 'inactive';
    const isActive = subscriptionStatus === 'active';

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    console.log(`✅ Login successful for ${email} | Subscription: ${subscriptionStatus}`);

    return res.status(isActive ? 200 : 403).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        subscription: subscriptionStatus,
        isActive,
      },
      message: isActive ? 'Login successful' : 'Subscription required',
    });
  } catch (err) {
    console.error("🔥 Login error:", err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
