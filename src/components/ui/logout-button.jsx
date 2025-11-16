'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton({ className = '' }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await fetch(`${API}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      // ignore errors — still redirect
      console.error('Logout failed', err);
    } finally {
      router.push('/login');
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
