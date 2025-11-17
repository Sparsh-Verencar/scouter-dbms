'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RecruiterLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get('email')?.toString();
    const password = fd.get('pwd')?.toString();

    if (!email || !password) {
      setErr('Provide email and password');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/recruiter-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Login failed');
      }

      // cookie is set server-side
      router.push('/recruiter-dashboard');

    } catch (error) {
      setErr(error.message);
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form onSubmit={handleSubmit} className="bg-card m-auto w-full max-w-sm rounded border p-0.5 shadow-md">
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <Image 
                src="/logo.jpeg"
                alt="Logo"
                width={40}
                height={40}
              />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Recruiter Sign In</h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm">Email</label>
              <Input type="email" required name="email" id="email" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <label htmlFor="pwd" className="text-sm">Password</label>
                <Link href="#" className="text-sm">Forgot?</Link>
              </div>
              <Input type="password" required name="pwd" id="pwd" />
            </div>

            {err && <div className="text-sm text-red-500">{err}</div>}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="text-center text-sm mt-2">
              Don't have an account? 
              <Link href="/recruiter-register" className="underline ml-1">
                Register
              </Link>
            </p>
          </div>
        </div>
      </form>
    </section>
  );
}
