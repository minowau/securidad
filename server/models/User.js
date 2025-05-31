import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  pin: {
    type: String,
    required: [true, 'PIN is required'],
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
    lockUntil: Date,
    lastLoginIP: String,
    lastLoginDevice: String
  },
  refreshToken: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: Date
}, {
  timestamps: true
});

userSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

// Hash password and PIN before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') && !this.isModified('pin')) {
    return next();
  }

  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
    
    if (this.isModified('pin')) {
      const salt = await bcrypt.genSalt(12);
      this.pin = await bcrypt.hash(this.pin, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.comparePin = async function(candidatePin) {
  return bcrypt.compare(candidatePin, this.pin);
};

userSchema.methods.comparePattern = function(candidatePattern) {
  if (!this.drawPattern.length || !candidatePattern.length) return false;
  if (this.drawPattern.length !== candidatePattern.length) return false;
  
  const similarity = this.drawPattern.reduce((score, point, index) => {
    const diff = Math.abs(point - candidatePattern[index]);
    return score + (diff < 10 ? 1 : 0);
  }, 0) / this.drawPattern.length;
  
  return similarity >= 0.8;
};

export default mongoose.model('User', userSchema);