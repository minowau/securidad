import express from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create new transaction
router.post('/',
  authMiddleware,
  [
    body('fromAccountId').notEmpty(),
    body('amount').isFloat({ min: 0.01 }),
    body('type').isIn(['transfer', 'deposit', 'withdrawal']),
    body('description').trim().optional(),
    body('category').isIn(['shopping', 'bills', 'dining', 'income', 'transfer', 'other'])
  ],
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { fromAccountId, toAccountId, amount, type, description, category } = req.body;

      // Verify account ownership
      const fromAccount = await Account.findOne({
        _id: fromAccountId,
        userId: req.user.id
      });

      if (!fromAccount) {
        return res.status(404).json({ error: 'Source account not found' });
      }

      if (fromAccount.balance < amount) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      // Create transaction
      const transaction = new Transaction({
        fromAccount: fromAccountId,
        toAccount: toAccountId,
        amount,
        type,
        description,
        category,
        status: 'completed'
      });

      // Update account balances
      fromAccount.balance -= amount;
      await fromAccount.save({ session });

      if (toAccountId) {
        const toAccount = await Account.findById(toAccountId);
        if (toAccount) {
          toAccount.balance += amount;
          await toAccount.save({ session });
        }
      }

      await transaction.save({ session });
      await session.commitTransaction();

      res.status(201).json(transaction);
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ error: 'Failed to process transaction' });
    } finally {
      session.endSession();
    }
  }
);

// Get transaction history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });
    const accountIds = accounts.map(account => account._id);

    const transactions = await Transaction.find({
      $or: [
        { fromAccount: { $in: accountIds } },
        { toAccount: { $in: accountIds } }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(50);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;