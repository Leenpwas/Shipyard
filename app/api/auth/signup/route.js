import { createUser, getUserByEmail } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, displayName, email, password } = await request.json();

    if (!username || !displayName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const user = createUser({ username, displayName, email, password });
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
