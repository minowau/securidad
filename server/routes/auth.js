import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const loginValidation = [
  body('username').trim().notEmpty(),
  body('password').trim().notEmpty()
];

const registerValidation = [
  body('username').trim().isLength({ min: 3 }),
  body('email').trim().isEmail(),
  body('password').trim().isLength({ min: 8 }),
  body('pin').trim().isLength({ min: 4, max: 4 }).isNumeric()
];

router.post('/register', registerValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, pin } = req.body;

  const user = await User.create({
    username,
    email,
    password,
    pin
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    token,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
}));

router.post('/login', loginValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    user && user.securitySettings.loginAttempts++;
    if (user && user.securitySettings.loginAttempts >= 5) {
      user.securitySettings.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    }
    if (user) await user.save();
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.securitySettings.lockUntil && user.securitySettings.lockUntil > new Date()) {
    return res.status(401).json({
      error: 'Account locked. Try again later.',
      lockUntil: user.securitySettings.lockUntil
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  user.securitySettings.loginAttempts = 0;
  user.securitySettings.lastLogin = new Date();
  user.securitySettings.lastLoginIP = req.ip;
  user.securitySettings.lastLoginDevice = req.headers['user-agent'];
  user.refreshToken = refreshToken;
  user.lastActivity = new Date();
  await user.save();

  res.json({
    token,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    },
    requiresPin: true
  });
}));

router.post('/verify-pin', authMiddleware, asyncHandler(async (req, res) => {
  const { pin } = req.body;
  const user = await User.findById(req.user.id);

  if (!user || !(await user.comparePin(pin))) {
    return res.status(401).json({ error: 'Invalid PIN' });
  }

  user.lastActivity = new Date();
  await user.save();

  res.json({ verified: true });
}));

router.post('/verify-pattern', authMiddleware, asyncHandler(async (req, res) => {
  const { pattern } = req.body;
  const user = await User.findById(req.user.id);

  if (!user || !user.comparePattern(pattern)) {
    return res.status(401).json({ error: 'Pattern verification failed' });
  }

  user.lastActivity = new Date();
  await user.save();

  res.json({ verified: true });
}));

router.post('/save-pattern', authMiddleware, asyncHandler(async (req, res) => {
  const { pattern } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.drawPattern = pattern;
  user.lastActivity = new Date();
  await user.save();

  res.json({ message: 'Pattern saved successfully' });
}));

router.post('/refresh-token', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  const user = await User.findOne({ refreshToken });
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const newToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: newToken });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}));

router.post('/logout', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (user) {
    user.refreshToken = undefined;
    await user.save();
  }

  res.json({ message: 'Logged out successfully' });
}));

export default router;