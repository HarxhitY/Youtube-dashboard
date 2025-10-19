import React, { useState } from 'react';
import VideoDetails from './VideoDetails';
import CommentsPanel from './CommentsPanel';
import NotesPanel from './NotesPanel';
import LogsPanel from './LogsPanel';

export default function Home() {
  const [videoId, setVideoId] = useState('');
  const [activeId, setActiveId] = useState(null);

  function load() {
    setActiveId(videoId.trim());
  }

  return (
    <div>
      {/* Video Input */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          placeholder="Enter YouTube video ID (e.g. _VIDEOID_)"
          value={videoId}
          onChange={e => setVideoId(e.target.value)}
        />
        <button onClick={load}>Load Video</button>
      </div>

      {/* Main Dashboard */}
      {activeId && (
        <div className="grid-two-col">
          {/* Left Column */}
          <div>
            <VideoDetails videoId={activeId} />
            <CommentsPanel videoId={activeId} />
          </div>

          {/* Right Column */}
          <div>
            <NotesPanel videoId={activeId} />
            <LogsPanel />
          </div>
        </div>
      )}
    </div>
  );
}
