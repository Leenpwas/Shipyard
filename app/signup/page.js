'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const { user, signup, loading: authLoading } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.push('/');
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signup({ displayName, username, email, password });
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>ShipYard</h1>
          <p>Start shipping.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <label>Name</label>
          <input className="input-field" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" required />
          <label>Username</label>
          <input className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" required />
          <label>Email</label>
          <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <label>Password</label>
          <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required />
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
