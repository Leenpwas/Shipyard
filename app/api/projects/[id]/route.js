import { getProjectById, getUserById, toggleProjectLike, joinProject, leaveProject } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const creator = getUserById(project.creatorId);
  const members = project.memberIds.map((mid) => getUserById(mid)).filter(Boolean);

  return NextResponse.json({ project: { ...project, creator, members } });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { action, userId } = await request.json();

  if (action === 'like') {
    const project = toggleProjectLike(id, userId);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json({ project });
  }

  if (action === 'join') {
    const project = joinProject(id, userId);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    const members = project.memberIds.map((mid) => getUserById(mid)).filter(Boolean);
    return NextResponse.json({ project: { ...project, members } });
  }

  if (action === 'leave') {
    const project = leaveProject(id, userId);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json({ project });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
