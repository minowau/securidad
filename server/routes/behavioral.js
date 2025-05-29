import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Update behavioral profile
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { typingPatterns, touchPatterns, navigationPatterns } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update behavioral profile
    user.behavioralProfile = {
      typingPatterns: typingPatterns || user.behavioralProfile.typingPatterns,
      touchPatterns: touchPatterns || user.behavioralProfile.touchPatterns,
      navigationPatterns: navigationPatterns || user.behavioralProfile.navigationPatterns,
      lastUpdated: new Date(),
      confidenceScore: calculateConfidenceScore(user.behavioralProfile)
    };

    await user.save();
    res.json({ message: 'Behavioral profile updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update behavioral profile' });
  }
});

// Get behavioral profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('behavioralProfile');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.behavioralProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch behavioral profile' });
  }
});

function calculateConfidenceScore(profile) {
  // Implement confidence score calculation based on behavioral data
  const dataPoints = (
    profile.typingPatterns.length +
    profile.touchPatterns.length +
    profile.navigationPatterns.length
  );
  return Math.min(dataPoints / 100, 1);
}

export default router;