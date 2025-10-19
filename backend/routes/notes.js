const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Note = require('../models/Note');
const logEvent = require('../utils/logger');

// GET /api/notes?videoId=&q=&tags=
router.get('/', auth, async (req, res) => {
  const { videoId, q, tags, limit = 20, page = 1 } = req.query;
  let filter = { userId: req.user._id };
  if (videoId) filter.videoId = videoId;
  if (tags) filter.tags = { $all: tags.split(',').map(t => t.trim()) };
  try {
    let query;
    if (q) {
      query = Note.find(filter).find({ $text: { $search: q } });
    } else {
      query = Note.find(filter);
    }
    const notes = await query.sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit, 10));
    res.json(notes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST create note
router.post('/', auth, async (req, res) => {
  try {
    const { title, body, tags = [], videoId } = req.body;
    const note = await Note.create({ userId: req.user._id, title, body, tags, videoId });
    await logEvent(req.user._id, 'CREATE_NOTE', { noteId: note._id, videoId });
    res.json(note);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PATCH update note
router.patch('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
    await logEvent(req.user._id, 'UPDATE_NOTE', { noteId: note._id });
    res.json(note);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE note
router.delete('/:id', auth, async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id, userId: req.user._id });
    await logEvent(req.user._id, 'DELETE_NOTE', { noteId: req.params.id });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
