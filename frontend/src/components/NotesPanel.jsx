import React, { useEffect, useState } from 'react';
import { searchNotes, createNote, updateNote, deleteNote } from '../api';

export default function NotesPanel({ videoId }) {
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');

  async function load() {
    const resp = await searchNotes({ videoId, q });
    setNotes(resp.data);
  }
  useEffect(() => { load(); }, [videoId]);

  async function add() {
    if (!title) return alert('Title required');
    await createNote({ title, body, tags: tags.split(',').map(t => t.trim()).filter(Boolean), videoId });
    setTitle(''); setBody(''); setTags('');
    await load();
  }

  async function remove(id) {
    if (!confirm('Delete note?')) return;
    await deleteNote(id);
    await load();
  }

  async function edit(note) {
    const newTitle = prompt('Title', note.title);
    if (newTitle === null) return;
    const newBody = prompt('Body', note.body);
    await updateNote(note._id, { title: newTitle, body: newBody });
    await load();
  }

  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6, marginTop: 12 }}>
      <h3>Notes</h3>
      <div>
        <input placeholder="Search notes" value={q} onChange={e => setQ(e.target.value)} />
        <button onClick={load}>Search</button>
      </div>
      <div style={{ marginTop: 8 }}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Tags comma separated" value={tags} onChange={e => setTags(e.target.value)} />
        <textarea placeholder="Note body" value={body} onChange={e => setBody(e.target.value)} />
        <button onClick={add}>Add Note</button>
      </div>
      <div>
        {notes.map(n => (
          <div key={n._id} style={{ marginTop: 8, borderTop: '1px dashed #eee', paddingTop: 6 }}>
            <b>{n.title}</b>
            <p>{n.body}</p>
            <small>{(n.tags||[]).join(', ')}</small><br />
            <button onClick={() => edit(n)}>Edit</button>
            <button onClick={() => remove(n._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
