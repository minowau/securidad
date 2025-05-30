import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    enum: ['checking', 'savings', 'investment'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'frozen'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to generate account number
accountSchema.pre('save', async function(next) {
  if (!this.accountNumber) {
    // Generate a random 10-digit account number
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
    this.accountNumber = randomNum.toString();
  }
  next();
});

export default mongoose.model('Account', accountSchema);