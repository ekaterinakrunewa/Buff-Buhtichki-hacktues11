require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Fixed CORS Configuration - Allow all origins during development
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, 'static'))); // Serve static files

// Routes
app.use('/api/auth', authRoutes);

// Database Connection
const db = require('./config/db');
db.getConnection()
    .then(connection => {
        console.log('Database connection established successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});