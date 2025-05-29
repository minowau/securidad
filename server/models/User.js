import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  behavioralProfile: {
    typingPatterns: [Number],
    touchPatterns: [Number],
    navigationPatterns: [Number],
    lastUpdated: Date,
    confidenceScore: {
      type: Number,
      default: 0
    }
  },
  securitySettings: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);