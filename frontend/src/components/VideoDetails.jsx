import React, { useEffect, useState } from 'react';
import { getVideo, editVideo } from '../api';

export default function VideoDetails({ videoId }) {
  const [video, setVideo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function load() {
    try {
      const resp = await getVideo(videoId);
      const item = resp.data.items && resp.data.items[0];
      setVideo(item);
      setTitle(item.snippet.title);
      setDescription(item.snippet.description);
    } catch (e) {
      console.error(e);
      alert('Failed to fetch video. Make sure the videoId is correct and your channel owns the video.');
    }
  }

  useEffect(() => { load(); }, [videoId]);

  async function save() {
    try {
      await editVideo(videoId, { title, description });
      setEditing(false);
      await load();
      alert('Updated!');
    } catch (e) {
      console.error(e);
      alert('Failed to update.');
    }
  }

  if (!video) return <div>Loading video...</div>;

  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
      <h2>Video Details</h2>
      <img src={video.snippet.thumbnails?.default?.url} alt="thumb" />
      {!editing ? (
        <>
          <h3>{video.snippet.title}</h3>
          <p>{video.snippet.description}</p>
          <p>Privacy: {video.status.privacyStatus}</p>
          <p>Views: {video.statistics?.viewCount || 0}</p>
          <button onClick={() => setEditing(true)}>Edit Title/Description</button>
        </>
      ) : (
        <div>
          <div>
            <label>Title</label><br />
            <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div>
            <label>Description</label><br />
            <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%' }} rows={6} />
          </div>
          <button onClick={save}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
