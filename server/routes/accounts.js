import express from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Get all accounts for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Create new account
router.post('/', 
  authMiddleware,
  [
    body('name').trim().notEmpty(),
    body('type').isIn(['checking', 'savings', 'investment'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, type } = req.body;
      const account = new Account({
        userId: req.user.id,
        name,
        type
      });

      await account.save();
      res.status(201).json(account);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create account' });
    }
  }
);

// Get account transactions
router.get('/:accountId/transactions', authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.accountId,
      userId: req.user.id
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const transactions = await Transaction.find({
      $or: [
        { fromAccount: account._id },
        { toAccount: account._id }
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