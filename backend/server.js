// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');

// // Import routes
// const authRoutes = require('./routes/auth');
// const videoRoutes = require('./routes/videos');
// const commentRoutes = require('./routes/comments');
// const noteRoutes = require('./routes/notes');
// const eventRoutes = require('./routes/events');

// const app = express();

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());

// // API routes
// app.use('/auth', authRoutes);
// app.use('/api/videos', videoRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/notes', noteRoutes);
// app.use('/api/events', eventRoutes);

// // Connect to MongoDB
// const PORT = process.env.PORT || 4000;
// mongoose.connect(process.env.MONGODB_URI, { 
//   useNewUrlParser: true, 
//   useUnifiedTopology: true 
// })
// .then(() => {
//   console.log('Mongo connected');
//   app.listen(PORT, () => console.log('Server listening on', PORT));
// })
// .catch(err => {
//   console.error('Mongo connection error', err);
// });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const commentRoutes = require('./routes/comments');
const noteRoutes = require('./routes/notes');
const eventRoutes = require('./routes/events');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Register routes
app.use('/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/events', eventRoutes);

// Serve frontend static files
app.use(express.static(__dirname + '/../frontend/dist'));

// handle all other routes properly
app.use((req, res) => {
  res.sendFile(__dirname + '/../frontend/dist/index.html');
});

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log('Server listening on', PORT));
  })
  .catch((err) => console.error('Mongo connection error:', err));
