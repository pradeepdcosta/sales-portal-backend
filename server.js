const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const config = require('./config/config')[process.env.NODE_ENV || 'development'];
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const accountSectionRoutes = require('./routes/accountSections');
const pdfRoutes = require('./routes/pdf');

const app = express();

// Security middleware for production
if (process.env.NODE_ENV === 'production') {
    const helmet = require('helmet');
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
        },
    }));
}

// Enable CORS with configuration
app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api', accountSectionRoutes);
app.use('/api', pdfRoutes);

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'start.html'));
});

app.get('/start', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'start.html'));
});

app.get('/account-plan.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'account-plan.html'));
});

app.get('/sections/:section', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sections', req.params.section));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

// Start server
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
        
        await sequelize.sync({ force: false });
        console.log('Database synced');

        const server = app.listen(config.port, '0.0.0.0', () => {
            const addr = server.address();
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
            console.log(`Server listening on port ${addr.port}`);
        });

        // Configure keep-alive
        server.keepAliveTimeout = 65000;
        server.headersTimeout = 66000;

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('Server closed');
                sequelize.close().then(() => {
                    console.log('Database connection closed');
                    process.exit(0);
                });
            });
        });

    } catch (error) {
        console.error('Startup error:', error);
        process.exit(1);
    }
}

startServer(); 