import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const authUrl = `${API_BASE}/auth/google`;

export const getVideo = (videoId) =>
  axios.get(`${API_BASE}/api/videos/${videoId}`, { headers: getAuthHeaders() });

export const editVideo = (videoId, data) =>
  axios.patch(`${API_BASE}/api/videos/${videoId}`, data, { headers: getAuthHeaders() });

export const listComments = (videoId) =>
  axios.get(`${API_BASE}/api/comments/${videoId}`, { headers: getAuthHeaders() });

export const postComment = (videoId, text) =>
  axios.post(`${API_BASE}/api/comments/${videoId}`, { text }, { headers: getAuthHeaders() });

export const replyComment = (commentId, text) =>
  axios.post(`${API_BASE}/api/comments/${commentId}/reply`, { text }, { headers: getAuthHeaders() });

export const deleteComment = (commentId) =>
  axios.delete(`${API_BASE}/api/comments/${commentId}`, { headers: getAuthHeaders() });

export const searchNotes = (params) =>
  axios.get(`${API_BASE}/api/notes`, { params, headers: getAuthHeaders() });

export const createNote = (data) =>
  axios.post(`${API_BASE}/api/notes`, data, { headers: getAuthHeaders() });

export const updateNote = (id, data) =>
  axios.patch(`${API_BASE}/api/notes/${id}`, data, { headers: getAuthHeaders() });

export const deleteNote = (id) =>
  axios.delete(`${API_BASE}/api/notes/${id}`, { headers: getAuthHeaders() });

export const getEvents = () =>
  axios.get(`${API_BASE}/api/events`, { headers: getAuthHeaders() });
