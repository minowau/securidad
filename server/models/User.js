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
  pin: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4
  },
  drawPattern: {
    type: [Number],
    default: []
  },
  behavioralProfile: {
    typingPatterns: [Number],
    touchPatterns: [Number],
    navigationPatterns: [Number],
    drawingPatterns: [Number],
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

// Hash password and PIN before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isModified('pin')) {
    try {
      const salt = await bcrypt.genSalt(12);
      if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, salt);
      }
      if (this.isModified('pin')) {
        this.pin = await bcrypt.hash(this.pin, salt);
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Compare PIN method
userSchema.methods.comparePin = async function(candidatePin) {
  return bcrypt.compare(candidatePin, this.pin);
};

// Compare drawing pattern
userSchema.methods.comparePattern = function(candidatePattern) {
  if (!this.drawPattern.length || !candidatePattern.length) return false;
  if (this.drawPattern.length !== candidatePattern.length) return false;
  
  // Calculate pattern similarity score
  const similarity = this.drawPattern.reduce((score, point, index) => {
    const diff = Math.abs(point - candidatePattern[index]);
    return score + (diff < 10 ? 1 : 0); // Tolerance threshold of 10
  }, 0) / this.drawPattern.length;
  
  return similarity >= 0.8; // 80% similarity required
};

export default mongoose.model('User', userSchema);