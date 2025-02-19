require('dotenv').config();

module.exports = {
    development: {
        port: process.env.PORT || 5000,
        database: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            name: process.env.DB_NAME || 'sales_portal',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres'
        },
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
        corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5000'
    },
    production: {
        port: process.env.PORT || 80,
        database: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            name: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: {
                rejectUnauthorized: false
            }
        },
        jwtSecret: process.env.JWT_SECRET,
        corsOrigin: process.env.CORS_ORIGIN
    }
}; 