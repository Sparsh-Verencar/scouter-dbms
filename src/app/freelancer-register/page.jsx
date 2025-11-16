'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
  e.preventDefault();
  setErr('');
  setSuccess('');
  setLoading(true);

  // Get form data
  const fd = new FormData(e.currentTarget);
  const email = (fd.get('email')?.toString() || '').trim();
  const name = (fd.get('name')?.toString() || '').trim();
  const password = (fd.get('password')?.toString() || '').trim();
  const phone = (fd.get('phone')?.toString() || '').trim();
  const experience = parseInt(fd.get('experience')?.toString() || '0', 10);
  const category = (fd.get('category')?.toString() || '').trim();

  // Basic validation
  if (!email || !password || !name || !phone || !category) {
    setErr('Please fill in all required fields.');
    setLoading(false);
    return;
  }

  try {
    const res = await fetch('http://localhost:3001/api/auth/freelancer-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, phone, experience, category }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || 'Registration failed');
    }

    setSuccess('Account created. Redirecting to login...');
    setLoading(false); // stop loading before redirect
    setTimeout(() => router.push('/freelancer-login'), 900);
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

        <label className="block text-sm mb-1" htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          placeholder="Your full name"
          required
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

        <label htmlFor="phone" className="block text-sm mb-1">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="123-456-7890"
          required
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <label htmlFor="experience" className="block text-sm mb-1">Experience (years)</label>
        <input
          id="experience"
          name="experience"
          type="number"
          placeholder="0"
          min={0}
          required
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />

        
        <label htmlFor="category" className="block text-sm mb-1">Category</label>
        <input
          id="category"
          name="category"
          placeholder="Your category"
          required
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
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
