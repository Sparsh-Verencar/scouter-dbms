import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
import { findUserByEmail } from '../../../lib/users';
import cookie from 'cookie';

export async function GET(req) {
  try {
    const header = req.headers.get('cookie') || '';
    const cookies = cookie.parse(header || '');
    const token = cookies.auth_token;
    if (!token) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const user = await findUserByEmail(payload.email);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { passwordHash, ...safe } = user;
    return NextResponse.json({ user: safe });
  } catch (err) {
    console.error('me error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
