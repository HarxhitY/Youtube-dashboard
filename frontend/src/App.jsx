import React, { useEffect, useState } from 'react';
import AuthButton from './components/AuthButton';
import Home from './components/Home';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // If redirected from backend with token query
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      localStorage.setItem('token', t);
      setToken(t);
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>YouTube Companion Dashboard</h1>
      <AuthButton token={token} />
      {token ? <Home /> : <p>Please sign in with Google to manage your video.</p>}
    </div>
  );
}
