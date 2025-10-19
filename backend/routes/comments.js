const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const youtubeService = require('../services/youtubeService');
const logEvent = require('../utils/logger');

// list
router.get('/:videoId', auth, async (req, res) => {
  try {
    const data = await youtubeService.listComments(req.user, req.params.videoId, req.query.pageToken);
    await logEvent(req.user._id, 'LIST_COMMENTS', { videoId: req.params.videoId });
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to list comments' });
  }
});

// post top-level comment
router.post('/:videoId', auth, async (req, res) => {
  try {
    const data = await youtubeService.insertComment(req.user, req.params.videoId, req.body.text);
    await logEvent(req.user._id, 'CREATE_COMMENT', { videoId: req.params.videoId, commentId: data.id });
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// reply
router.post('/:commentId/reply', auth, async (req, res) => {
  try {
    const data = await youtubeService.replyToComment(req.user, req.params.commentId, req.body.text);
    await logEvent(req.user._id, 'REPLY_COMMENT', { parentId: req.params.commentId, commentId: data.id });
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to reply' });
  }
});

// delete comment
router.delete('/:commentId', auth, async (req, res) => {
  try {
    await youtubeService.deleteComment(req.user, req.params.commentId);
    await logEvent(req.user._id, 'DELETE_COMMENT', { commentId: req.params.commentId });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
