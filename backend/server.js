require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const commentRoutes = require('./routes/comments');
const noteRoutes = require('./routes/notes');
const eventRoutes = require('./routes/events');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/events', eventRoutes);

// Optional test route
app.get('/api/ping', (req, res) => res.json({ message: 'pong' }));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Connect to MongoDB and start server
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Mongo connected');
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
})
.catch(err => {
  console.error('Mongo connection error', err);
  process.exit(1); // Exit if MongoDB connection fails
});
