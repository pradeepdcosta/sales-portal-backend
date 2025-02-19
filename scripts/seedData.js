const sequelize = require('../config/database');
const { User, Account, AccountSection } = require('../models');
const bcrypt = require('bcryptjs');

async function seedData() {
    try {
        // Sync database
        await sequelize.sync({ force: true }); // This will recreate all tables - be careful in production!
        console.log('Database synced');

        // Create 50 users (account managers)
        const users = [];
        for (let i = 1; i <= 50; i++) {
            const user = await User.create({
                username: `User${i}`,
                email: `user${i}@example.com`,
                password: 'password123', // Password will be hashed by User model hooks
                firstName: `First${i}`,
                lastName: `Last${i}`,
                role: 'manager'
            });
            users.push(user);
            console.log(`Created user ${i}`);
        }

        // Create 50 customer accounts
        const accounts = [];
        for (let i = 1; i <= 50; i++) {
            const account = await Account.create({
                name: `Cust${i}`,
                accountId: `GAN${i}`,
                overview: `Overview for Customer ${i}`,
                strategy: `Strategy for Customer ${i}`,
                executiveSummary: `Executive Summary for Customer ${i}`,
                managementSummary: `Management Summary for Customer ${i}`,
                accountVision: `Account Vision for Customer ${i}`,
                executiveSponsor: `Executive Sponsor for Customer ${i}`,
                keyAccountInfo: `Key Account Information for Customer ${i}`,
                priorityOpportunities: `Priority Opportunities for Customer ${i}`,
                businessOverview: `Business Overview for Customer ${i}`,
                businessStrategy: `Business Strategy for Customer ${i}`,
                marketDrivers: `Market Drivers for Customer ${i}`
            });
            accounts.push(account);
            console.log(`Created account ${i}`);

            // Associate account with its manager
            await account.addUser(users[i-1]);
            console.log(`Associated account ${i} with user ${i}`);

            // Create default sections for the account
            const sectionTypes = ['executive_summary', 'customer_overview', 'account_overview', 'relationship_map'];
            for (const sectionType of sectionTypes) {
                await AccountSection.create({
                    accountId: account.id,
                    sectionType,
                    content: {
                        lastUpdated: new Date(),
                        data: {} // Empty object to be filled by account manager
                    },
                    lastModifiedBy: users[i-1].id,
                    lastModifiedAt: new Date()
                });
                console.log(`Created ${sectionType} section for account ${i}`);
            }
        }

        console.log('Data seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedData(); 