'use client';


import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterRegisterPage() {
  const router = useRouter();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setSuccess('');
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    // Recruiter fields
    const email = (fd.get('email')?.toString() || '').trim();
    const full_name = (fd.get('full_name')?.toString() || '').trim();
    const company_name = (fd.get('company_name')?.toString() || '').trim();
    const password = (fd.get('password')?.toString() || '').trim();
    const phone = (fd.get('phone')?.toString() || '').trim();

    // Validation
    if (!email || !password || !full_name || !company_name || !phone) {
      setErr('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/recruiter-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name,
          company_name,
          phone
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || 'Registration failed');
      }

      setSuccess('Account created. Redirecting to login...');
      setLoading(false);

      setTimeout(() => router.push('/recruiter-login'), 900);

    } catch (e) {
      setErr(e.message || 'Registration failed');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-card p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Recruiter Registration</h2>

        <label className="block text-sm mb-1" htmlFor="full_name">Full Name</label>
        <input
          id="full_name"
          name="full_name"
          placeholder="Your full name"
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block text-sm mb-1" htmlFor="company_name">Company Name</label>
        <input
          id="company_name"
          name="company_name"
          placeholder="Company"
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block text-sm mb-1" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
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
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block text-sm mb-1" htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="123-456-7890"
          required
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
