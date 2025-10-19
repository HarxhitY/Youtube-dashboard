const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const youtubeService = require('../services/youtubeService');
const logEvent = require('../utils/logger');

// GET /api/videos/:videoId
router.get('/:videoId', auth, async (req, res) => {
  const { videoId } = req.params;
  try {
    const data = await youtubeService.getVideoDetails(req.user, videoId);
    // log
    await logEvent(req.user._id, 'GET_VIDEO', { videoId });
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// PATCH /api/videos/:videoId
router.patch('/:videoId', auth, async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  try {
    const snippetUpdates = {};
    if (title) snippetUpdates.title = title;
    if (description) snippetUpdates.description = description;
    const resp = await youtubeService.updateVideo(req.user, videoId, snippetUpdates);
    await logEvent(req.user._id, 'EDIT_VIDEO', { videoId, new: { title, description } });
    res.json(resp);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

module.exports = router;
