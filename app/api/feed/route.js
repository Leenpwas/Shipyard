import { getAllPosts, getUserById, getProjectById } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = getAllPosts();
  const enriched = posts.map((p) => ({
    ...p,
    author: getUserById(p.authorId),
    project: getProjectById(p.projectId),
  }));
  return NextResponse.json({ posts: enriched });
}
