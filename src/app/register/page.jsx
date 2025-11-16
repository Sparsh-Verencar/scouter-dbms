'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // IMPORTANT: frontend must know the backend URL via NEXT_PUBLIC_API_URL
  // Put NEXT_PUBLIC_API_URL=http://localhost:4000 in your frontend .env.local
  const API = process.env.NEXT_PUBLIC_API_URL || '';

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setSuccess('');
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = (fd.get('email')?.toString() || '').trim();
    const name = (fd.get('name')?.toString() || '').trim();
    const password = (fd.get('password')?.toString() || '').trim();

    if (!email || !password) {
      setErr('Please provide both an email and a password.');
      setLoading(false);
      return;
    }

    try {
      if (!API) throw new Error('Backend API URL not configured. Set NEXT_PUBLIC_API_URL in .env.local');

      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Registration failed');
      }

      setSuccess('Account created. Redirecting to login...');
      // short pause so user sees success message
      setTimeout(() => router.push('/login'), 900);
    } catch (e) {
      setErr(e.message || 'Registration failed');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-card p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Create an account</h2>

        <label className="block text-sm mb-1" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block text-sm mb-1" htmlFor="name">Full name (optional)</label>
        <input
          id="name"
          name="name"
          placeholder="Your full name"
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block text-sm mb-1" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Choose a secure password"
          required
          minLength={6}
          className="w-full mb-4 p-2 border rounded"
        />

        {err && <div className="text-sm text-red-500 mb-3">{err}</div>}
        {success && <div className="text-sm text-green-600 mb-3">{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-primary text-black disabled:opacity-60"
        >
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>
    </div>
  );
}
