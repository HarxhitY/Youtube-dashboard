const { oauth2Client, google } = require('../config/googleOAuth');
const axios = require('axios');
const User = require('../models/User');

async function getAuthClient(user) {
  // user.refreshToken must be present
  const client = oauth2Client;
  client.setCredentials({ refresh_token: user.refreshToken });
  // force a refresh to get fresh access token
  try {
    const tokens = await client.getAccessToken(); // returns a token object
    // set credentials to client
    client.setCredentials({
      access_token: tokens.token,
      refresh_token: user.refreshToken
    });
  } catch (err) {
    console.error('Failed to refresh token', err);
    throw err;
  }
  return client;
}

async function getVideoDetails(user, videoId) {
  const auth = await getAuthClient(user);
  const youtube = google.youtube({ version: 'v3', auth });
  const resp = await youtube.videos.list({
    part: ['snippet', 'statistics', 'status'],
    id: [videoId]
  });
  return resp.data;
}

async function updateVideo(user, videoId, snippetUpdates) {
  const auth = await getAuthClient(user);
  const youtube = google.youtube({ version: 'v3', auth });
  // Need to pass the full snippet including resource id; first fetch current snippet
  const existing = await youtube.videos.list({ part: ['snippet'], id: [videoId] });
  if (!existing.data.items || existing.data.items.length === 0) throw new Error('Video not found');
  const snippet = Object.assign({}, existing.data.items[0].snippet, snippetUpdates);
  const resp = await youtube.videos.update({
    part: ['snippet'],
    requestBody: {
      id: videoId,
      snippet
    }
  });
  return resp.data;
}

async function listComments(user, videoId, pageToken) {
  const auth = await getAuthClient(user);
  const youtube = google.youtube({ version: 'v3', auth });
  const resp = await youtube.commentThreads.list({
    part: ['snippet', 'replies'],
    videoId,
    maxResults: 50,
    pageToken
  });
  return resp.data;
}

async function insertComment(user, videoId, text) {
  const auth = await getAuthClient(user);
  const youtube = google.youtube({ version: 'v3', auth });
  const resp = await youtube.commentThreads.insert({
    part: ['snippet'],
    requestBody: {
      snippet: {
        videoId,
        topLevelComment: {
          snippet: {
            textOriginal: text
          }
        }
      }
    }
  });
  return resp.data;
}

async function replyToComment(user, parentId, text) {
  const auth = await getAuthClient(user);
  const youtube = google.youtube({ version: 'v3', auth });
  const resp = await youtube.comments.insert({
    part: ['snippet'],
    requestBody: {
      snippet: {
        parentId,
        textOriginal: text
      }
    }
  });
  return resp.data;
}

async function deleteComment(user, commentId) {
  const auth = await getAuthClient(user);
  const youtube = google.youtube({ version: 'v3', auth });
  return youtube.comments.delete({ id: commentId });
}

module.exports = {
  getVideoDetails,
  updateVideo,
  listComments,
  insertComment,
  replyToComment,
  deleteComment
};
