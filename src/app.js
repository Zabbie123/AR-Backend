// backend/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { UPLOAD_PATH } = require('./config/env');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dishRoutes = require('./routes/dishRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader("ngrok-skip-browser-warning", "true");
    next();
});

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.usdz')) {
            res.setHeader('Content-Type', 'model/vnd.usdz+zip');
        }
    },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;