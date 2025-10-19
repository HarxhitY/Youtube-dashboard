import React from 'react';
import { authUrl } from '../api';

export default function AuthButton({ token }) {
  if (token) {
    return <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Sign out</button>;
  }
  return <a href={authUrl}><button>Sign in with Google</button></a>;
}
