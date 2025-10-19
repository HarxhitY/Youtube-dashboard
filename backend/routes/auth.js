const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { oauth2Client, generateAuthUrl, google } = require('../config/googleOAuth');

router.get('/google', (req, res) => {
  const url = generateAuthUrl();
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code.');
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // get user info and channel id
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const userInfo = (await oauth2.userinfo.get()).data;

    // get channel id using youtube.channels.list?mine=true
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const channelResp = await youtube.channels.list({ part: ['id', 'snippet'], mine: true });
    const channelId = (channelResp.data.items && channelResp.data.items[0] && channelResp.data.items[0].id) || null;

    // Save user (store refresh token if available)
    let user = await User.findOne({ googleId: userInfo.id });
    if (!user) {
      user = await User.create({
        googleId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        channelId,
        refreshToken: tokens.refresh_token || null
      });
    } else {
      user.email = userInfo.email;
      user.name = userInfo.name;
      user.channelId = channelId;
      if (tokens.refresh_token) user.refreshToken = tokens.refresh_token;
      await user.save();
    }

    // create a JWT to return to frontend
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // redirect back to frontend with token in query (or set cookie)
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?token=${jwtToken}`;
    res.redirect(redirectUrl);
  } catch (e) {
    console.error(e);
    res.status(500).send('Auth failed');
  }
});

module.exports = router;
