import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
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

// Register new user
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, pin } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username or email already exists' 
      });
    }

    const user = new User({ username, email, password, pin });
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update security settings
    user.securitySettings.lastLogin = new Date();
    user.securitySettings.loginAttempts = 0;
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, requiresPin: true });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify PIN
router.post('/verify-pin', authMiddleware, async (req, res) => {
  try {
    const { pin } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !(await user.comparePin(pin))) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    res.json({ verified: true });
  } catch (error) {
    res.status(500).json({ error: 'PIN verification failed' });
  }
});

// Verify drawing pattern
router.post('/verify-pattern', authMiddleware, async (req, res) => {
  try {
    const { pattern } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !user.comparePattern(pattern)) {
      return res.status(401).json({ error: 'Pattern verification failed' });
    }

    res.json({ verified: true });
  } catch (error) {
    res.status(500).json({ error: 'Pattern verification failed' });
  }
});

// Save drawing pattern
router.post('/save-pattern', authMiddleware, async (req, res) => {
  try {
    const { pattern } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.drawPattern = pattern;
    await user.save();

    res.json({ message: 'Pattern saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save pattern' });
  }
});

export default router;