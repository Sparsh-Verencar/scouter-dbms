import { NextResponse } from 'next/server';
import { findUserByEmail } from '../../../lib/users';
import { verifyPassword, signToken, setAuthCookie } from '../../../lib/auth';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ userId: user.id, email: user.email });

    // setAuthCookie returns the cookie string; set it on the response
    const cookieStr = setAuthCookie(null, token);
    const res = NextResponse.json({ ok: true });
    res.headers.set('Set-Cookie', cookieStr);
    return res;
  } catch (err) {
    console.error('login error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
