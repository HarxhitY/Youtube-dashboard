const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  videoId: String,
  title: String,
  body: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// text index for search
noteSchema.index({ title: 'text', body: 'text' });

module.exports = mongoose.model('Note', noteSchema);
