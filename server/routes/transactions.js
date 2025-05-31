import express from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// Transfer money with PIN verification
router.post('/transfer',
  authMiddleware,
  [
    body('fromAccountId').notEmpty(),
    body('toAccountId').notEmpty(),
    body('amount').isFloat({ min: 0.01 }),
    body('pin').isLength({ min: 4, max: 4 }).isNumeric(),
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

      const { fromAccountId, toAccountId, amount, pin, description, category } = req.body;

      // Verify PIN
      const user = await User.findById(req.user.id);
      if (!user || !(await user.comparePin(pin))) {
        return res.status(401).json({ error: 'Invalid PIN' });
      }

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
        type: 'transfer',
        description,
        category,
        status: 'completed'
      });

      // Update account balances
      fromAccount.balance -= amount;
      await fromAccount.save({ session });

      const toAccount = await Account.findById(toAccountId);
      if (toAccount) {
        toAccount.balance += amount;
        await toAccount.save({ session });
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

// Check balance with PIN verification
router.post('/balance/:accountId',
  authMiddleware,
  [
    body('pin').isLength({ min: 4, max: 4 }).isNumeric()
  ],
  async (req, res) => {
    try {
      const { pin } = req.body;

      // Verify PIN
      const user = await User.findById(req.user.id);
      if (!user || !(await user.comparePin(pin))) {
        return res.status(401).json({ error: 'Invalid PIN' });
      }

      const account = await Account.findOne({
        _id: req.params.accountId,
        userId: req.user.id
      });

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      res.json({
        balance: account.balance,
        accountNumber: account.accountNumber,
        name: account.name
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch balance' });
    }
  }
);

export default router;