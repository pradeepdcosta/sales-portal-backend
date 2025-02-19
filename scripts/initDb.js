const { sequelize, User, Account } = require('../models');
const bcrypt = require('bcryptjs');

const accountManagers = [
    { email: 'manager1@example.com', accounts: ['Account 1', 'Account 2'] },
    { email: 'manager2@example.com', accounts: ['Account 3'] }
    // Add your actual account managers and their accounts here
];

const initializeDatabase = async () => {
    try {
        // Sync database
        await sequelize.sync({ force: true }); // Be careful with force: true in production

        for (const manager of accountManagers) {
            // Create accounts
            const createdAccounts = await Promise.all(
                manager.accounts.map(accountName => 
                    Account.create({
                        name: accountName,
                        overview: `Overview for ${accountName}`,
                        strategy: `Strategy for ${accountName}`
                    })
                )
            );

            // Create account manager
            const user = await User.create({
                username: manager.email,
                password: 'password123', // Change this in production
                role: 'account_manager'
            });

            // Associate accounts with manager
            await user.setManagedAccounts(createdAccounts);
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await sequelize.close();
    }
};

// Run if called directly
if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase }; 