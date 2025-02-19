const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import account controller (we'll create this next)
const {
    createAccount,
    getAccounts,
    getAccountById,
    updateAccount,
    deleteAccount
} = require('../controllers/accountController');

// Account routes
router.post('/', protect, authorize('admin', 'manager'), createAccount);
router.get('/', protect, getAccounts);
router.get('/:id', protect, getAccountById);
router.put('/:id', protect, authorize('admin', 'manager'), updateAccount);
router.delete('/:id', protect, authorize('admin'), deleteAccount);

module.exports = router; 