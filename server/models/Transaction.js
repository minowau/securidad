import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  type: {
    type: String,
    enum: ['transfer', 'deposit', 'withdrawal'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['shopping', 'bills', 'dining', 'income', 'transfer', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
transactionSchema.index({ fromAccount: 1, timestamp: -1 });
transactionSchema.index({ toAccount: 1, timestamp: -1 });

export default mongoose.model('Transaction', transactionSchema);