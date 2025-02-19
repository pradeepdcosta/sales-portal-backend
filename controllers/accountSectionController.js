const { AccountSection, Account, User } = require('../models');

// Get all sections for an account
exports.getAccountSections = async (req, res) => {
    try {
        const { accountId } = req.params;
        
        // Check if user has access to this account
        const hasAccess = await Account.findOne({
            where: { id: accountId },
            include: [{
                model: User,
                where: { id: req.user.id }
            }]
        });

        if (!hasAccess && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this account'
            });
        }

        const sections = await AccountSection.findAll({
            where: { accountId }
        });

        res.json({
            success: true,
            data: sections
        });
    } catch (error) {
        console.error('Get sections error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving account sections'
        });
    }
};

// Get specific section for an account
exports.getAccountSection = async (req, res) => {
    try {
        const { accountId, sectionType } = req.params;

        // Check if user has access to this account
        const hasAccess = await Account.findOne({
            where: { id: accountId },
            include: [{
                model: User,
                as: 'users',
                where: { id: req.user.id }
            }]
        });

        if (!hasAccess && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this account'
            });
        }

        // Find or create the section
        const [section, created] = await AccountSection.findOrCreate({
            where: { accountId, sectionType },
            defaults: {
                content: {},
                lastModifiedBy: req.user.id,
                lastModifiedAt: new Date()
            }
        });

        res.json({
            success: true,
            data: section
        });
    } catch (error) {
        console.error('Get section error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving account section'
        });
    }
};

// Update or create section content
exports.updateAccountSection = async (req, res) => {
    try {
        const { accountId, sectionType } = req.params;
        const { content, lastModifiedBy, lastModifiedAt } = req.body;

        // Check if user has access to this account
        const hasAccess = await Account.findOne({
            where: { id: accountId },
            include: [{
                model: User,
                as: 'users',
                where: { id: req.user.id }
            }]
        });

        if (!hasAccess && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this account'
            });
        }

        // Find or create the section
        const [section, created] = await AccountSection.findOrCreate({
            where: { accountId, sectionType },
            defaults: {
                content,
                lastModifiedBy: lastModifiedBy || req.user.id,
                lastModifiedAt: lastModifiedAt || new Date()
            }
        });

        if (!created) {
            // Update existing section
            await section.update({
                content,
                lastModifiedBy: lastModifiedBy || req.user.id,
                lastModifiedAt: lastModifiedAt || new Date()
            });
        }

        res.json({
            success: true,
            data: section,
            message: created ? 'Section created successfully' : 'Section updated successfully'
        });
    } catch (error) {
        console.error('Update section error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating account section: ' + error.message
        });
    }
}; 