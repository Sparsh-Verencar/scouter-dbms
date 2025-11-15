import { NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '../../../lib/users';
import { hashPassword } from '../../../lib/auth';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const user = await createUser({ email, passwordHash, name });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    console.error('register error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
