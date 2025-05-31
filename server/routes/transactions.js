import express from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { authMiddleware } from '../middleware/auth.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/transfer',
  authMiddleware,
  [
    body('fromAccountId').notEmpty().isMongoId(),
    body('toAccountId').notEmpty().isMongoId(),
    body('amount').isFloat({ min: 0.01 }),
    body('pin').isLength({ min: 4, max: 4 }).isNumeric(),
    body('description').trim().optional(),
    body('category').isIn(['shopping', 'bills', 'dining', 'income', 'transfer', 'other'])
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { fromAccountId, toAccountId, amount, pin, description, category } = req.body;

      const user = await User.findById(req.user.id);
      if (!user || !(await user.comparePin(pin))) {
        throw new Error('Invalid PIN');
      }

      const fromAccount = await Account.findOne({
        _id: fromAccountId,
        userId: req.user.id
      }).session(session);

      if (!fromAccount) {
        throw new Error('Source account not found');
      }

      if (fromAccount.balance < amount) {
        throw new Error('Insufficient funds');
      }

      const toAccount = await Account.findById(toAccountId).session(session);
      if (!toAccount) {
        throw new Error('Destination account not found');
      }

      const transaction = new Transaction({
        fromAccount: fromAccountId,
        toAccount: toAccountId,
        amount,
        type: 'transfer',
        description,
        category,
        status: 'completed',
        timestamp: new Date()
      });

      fromAccount.balance -= amount;
      await fromAccount.save({ session });

      toAccount.balance += amount;
      await toAccount.save({ session });

      await transaction.save({ session });
      await session.commitTransaction();

      res.status(201).json({
        transaction,
        fromAccount: {
          id: fromAccount._id,
          balance: fromAccount.balance
        },
        toAccount: {
          id: toAccount._id,
          balance: toAccount.balance
        }
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  })
);

router.post('/balance/:accountId',
  authMiddleware,
  [
    body('pin').isLength({ min: 4, max: 4 }).isNumeric()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pin } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user || !(await user.comparePin(pin))) {
      throw new Error('Invalid PIN');
    }

    const account = await Account.findOne({
      _id: req.params.accountId,
      userId: req.user.id
    });

    if (!account) {
      throw new Error('Account not found');
    }

    res.json({
      balance: account.balance,
      accountNumber: account.accountNumber,
      name: account.name
    });
  })
);

router.get('/history/:accountId',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const account = await Account.findOne({
      _id: req.params.accountId,
      userId: req.user.id
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const transactions = await Transaction.find({
      $or: [
        { fromAccount: account._id },
        { toAccount: account._id }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(50)
    .populate('fromAccount', 'name accountNumber')
    .populate('toAccount', 'name accountNumber');

    res.json(transactions);
  })
);

export default router;