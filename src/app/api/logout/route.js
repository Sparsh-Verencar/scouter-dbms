import { NextResponse } from 'next/server';
import { clearAuthCookie } from '../../../lib/auth';

export async function POST() {
  try {
    const cookieStr = clearAuthCookie();
    const res = NextResponse.json({ ok: true });
    res.headers.set('Set-Cookie', cookieStr);
    return res;
  } catch (err) {
    console.error('logout error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
