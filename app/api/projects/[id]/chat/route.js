import { getMessagesByProject, createMessage, getUserById } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const messages = getMessagesByProject(id);
  const enriched = messages.map((m) => ({
    ...m,
    author: getUserById(m.authorId),
  }));
  return NextResponse.json({ messages: enriched });
}

export async function POST(request, { params }) {
  const { id } = await params;
  const { authorId, content } = await request.json();

  if (!authorId || !content) {
    return NextResponse.json({ error: 'authorId and content are required' }, { status: 400 });
  }

  const message = createMessage({ projectId: id, authorId, content });
  const author = getUserById(authorId);
  return NextResponse.json({ message: { ...message, author } }, { status: 201 });
}
