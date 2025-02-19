const { Account, User } = require('../models');

// Create new account
exports.createAccount = async (req, res) => {
    try {
        const account = await Account.create(req.body);
        
        // If managers are specified, associate them with the account
        if (req.body.managerIds) {
            const managers = await User.findAll({
                where: {
                    id: req.body.managerIds,
                    role: ['admin', 'manager']
                }
            });
            await account.addUsers(managers);
        }

        res.status(201).json({
            success: true,
            data: account
        });
    } catch (error) {
        console.error('Create account error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating account'
        });
    }
};

// Get all accounts (with filtering based on user role)
exports.getAccounts = async (req, res) => {
    try {
        let accounts;
        
        if (req.user.role === 'admin') {
            // Admins can see all accounts
            accounts = await Account.findAll({
                include: [{
                    model: User,
                    as: 'users',
                    attributes: ['id', 'username', 'email', 'role']
                }]
            });
        } else {
            // Managers and salespeople can only see their associated accounts
            const user = await User.findByPk(req.user.id, {
                include: [{
                    model: Account,
                    as: 'managedAccounts',
                    include: [{
                        model: User,
                        as: 'users',
                        attributes: ['id', 'username', 'email', 'role']
                    }]
                }]
            });

            if (!user || !user.managedAccounts) {
                return res.status(404).json({
                    success: false,
                    message: 'No accounts found for this user'
                });
            }

            accounts = user.managedAccounts;
        }

        res.json({
            success: true,
            data: {
                managedAccounts: accounts
            }
        });
    } catch (error) {
        console.error('Get accounts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving accounts: ' + error.message
        });
    }
};

// Get single account by ID
exports.getAccountById = async (req, res) => {
    try {
        const account = await Account.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'users',
                attributes: ['id', 'username', 'email', 'role']
            }]
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        // Check if user has access to this account
        if (req.user.role !== 'admin') {
            const hasAccess = await account.hasUser(req.user.id);
            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to access this account'
                });
            }
        }

        res.json({
            success: true,
            data: account
        });
    } catch (error) {
        console.error('Get account error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving account'
        });
    }
};

// Update account
exports.updateAccount = async (req, res) => {
    try {
        const account = await Account.findByPk(req.params.id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        // Update account fields
        await account.update(req.body);

        // Update manager associations if provided
        if (req.body.managerIds) {
            const managers = await User.findAll({
                where: {
                    id: req.body.managerIds,
                    role: ['admin', 'manager']
                }
            });
            await account.setUsers(managers);
        }

        // Get updated account with associations
        const updatedAccount = await Account.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'users',
                attributes: ['id', 'username', 'email', 'role']
            }]
        });

        res.json({
            success: true,
            data: updatedAccount
        });
    } catch (error) {
        console.error('Update account error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating account'
        });
    }
};

// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        const account = await Account.findByPk(req.params.id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        await account.destroy();

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting account'
        });
    }
}; 