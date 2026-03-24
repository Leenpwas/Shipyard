import { getUserById, getProjectsByCreator, getProjectsByMember } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const user = getUserById(id);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { password: _, ...safeUser } = user;
  const ownedProjects = getProjectsByCreator(id);
  const joinedProjects = getProjectsByMember(id).filter((p) => p.creatorId !== id);

  return NextResponse.json({
    user: safeUser,
    ownedProjects,
    joinedProjects,
  });
}
