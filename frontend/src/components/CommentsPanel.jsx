import React, { useEffect, useState } from 'react';
import { listComments, postComment, replyComment, deleteComment } from '../api';

export default function CommentsPanel({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const resp = await listComments(videoId);
      setComments(resp.data.items || []);
    } catch (e) {
      console.error(e);
      alert('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [videoId]);

  async function post() {
    if (!text) return;
    await postComment(videoId, text);
    setText('');
    await load();
  }

  async function reply(parentId) {
    const r = prompt('Reply text:');
    if (!r) return;
    await replyComment(parentId, r);
    await load();
  }

  async function del(commentId) {
    if (!confirm('Delete this comment?')) return;
    await deleteComment(commentId);
    await load();
  }

  return (
    <div style={{ marginTop: 12, padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
      <h3>Comments</h3>
      <div>
        <input placeholder="Write a comment..." value={text} onChange={e => setText(e.target.value)} style={{ width: '80%' }} />
        <button onClick={post}>Post</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <div>
          {comments.map(thread => {
            const top = thread.snippet.topLevelComment.snippet;
            return (
              <div key={thread.id} style={{ marginTop: 12, padding: 8, borderBottom: '1px solid #eee' }}>
                <b>{top.authorDisplayName}</b>
                <p>{top.textDisplay}</p>
                <small>Likes: {top.likeCount}</small><br />
                <button onClick={() => reply(thread.snippet.topLevelComment.id)}>Reply</button>
                <button onClick={() => del(thread.snippet.topLevelComment.id)}>Delete</button>

                {thread.replies && thread.replies.comments.map(r => (
                  <div key={r.id} style={{ marginLeft: 20, marginTop: 6 }}>
                    <b>{r.snippet.authorDisplayName}</b>
                    <p>{r.snippet.textDisplay}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
