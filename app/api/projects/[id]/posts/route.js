import { getPostsByProject, createPost, getUserById, togglePostLike } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const posts = getPostsByProject(id);
  const enriched = posts.map((p) => ({
    ...p,
    author: getUserById(p.authorId),
  }));
  return NextResponse.json({ posts: enriched });
}

export async function POST(request, { params }) {
  const { id } = await params;
  const { authorId, content } = await request.json();

  if (!authorId || !content) {
    return NextResponse.json({ error: 'authorId and content are required' }, { status: 400 });
  }

  const post = createPost({ projectId: id, authorId, content });
  const author = getUserById(authorId);
  return NextResponse.json({ post: { ...post, author } }, { status: 201 });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { postId, userId } = await request.json();

  const post = togglePostLike(postId, userId);
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  const author = getUserById(post.authorId);
  return NextResponse.json({ post: { ...post, author } });
}
