const Event = require('../models/Event');

async function logEvent(userId, action, meta = {}) {
  try {
    await Event.create({ userId, action, meta, createdAt: new Date() });
  } catch (e) {
    console.error('Failed to log event', e);
  }
}

module.exports = logEvent;
