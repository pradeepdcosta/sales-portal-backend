const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getAccountSections,
    getAccountSection,
    updateAccountSection
} = require('../controllers/accountSectionController');

// Account section routes
router.get('/account/:accountId/sections', protect, getAccountSections);
router.get('/account/:accountId/section/:sectionType', protect, getAccountSection);
router.put('/account/:accountId/section/:sectionType', protect, updateAccountSection);

module.exports = router; 