import React, { useEffect, useState } from 'react';
import { getEvents } from '../api';

export default function LogsPanel() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    async function load() {
      const resp = await getEvents();
      setEvents(resp.data);
    }
    load();
  }, []);
  return (
    <div style={{ marginTop: 12, padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
      <h3>Activity Logs</h3>
      {events.map(e => (
        <div key={e._id} style={{ borderBottom: '1px dashed #eee', paddingBottom: 6 }}>
          <small>{new Date(e.createdAt).toLocaleString()}</small>
          <div>{e.action} — {e.videoId || ''}</div>
          <div><code>{JSON.stringify(e.meta)}</code></div>
        </div>
      ))}
    </div>
  );
}
