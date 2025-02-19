require('dotenv').config({ path: '../.env' });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'Sales_Portal',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'Rjprr9920054204@',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

async function checkUsers() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('Connected to database successfully.');

        // Query users table directly
        const users = await sequelize.query('SELECT id, username, email, "firstName", "lastName", role, "createdAt" FROM "Users"', {
            type: Sequelize.QueryTypes.SELECT
        });

        console.log('\nRegistered Users:');
        console.log('================');
        users.forEach(user => {
            console.log(`\nUser ID: ${user.id}`);
            console.log(`Username: ${user.username}`);
            console.log(`Email: ${user.email}`);
            console.log(`Name: ${user.firstName} ${user.lastName}`);
            console.log(`Role: ${user.role}`);
            console.log(`Created: ${user.createdAt}`);
            console.log('----------------');
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkUsers(); 