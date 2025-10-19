const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Event = require('../models/Event');

// GET events for user (paginated)
router.get('/', auth, async (req, res) => {
  const { limit = 50, page = 1 } = req.query;
  try {
    const events = await Event.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));
    res.json(events);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;
