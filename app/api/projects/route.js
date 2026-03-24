import { getProjects, createProject, getUserById } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
  const projects = getProjects();
  // Enrich with creator info
  const enriched = projects.map((p) => ({
    ...p,
    creator: getUserById(p.creatorId),
  }));
  return NextResponse.json({ projects: enriched });
}

export async function POST(request) {
  try {
    const { name, description, techStack, creatorId } = await request.json();

    if (!name || !description || !creatorId) {
      return NextResponse.json({ error: 'Name, description, and creatorId are required' }, { status: 400 });
    }

    const project = createProject({ name, description, techStack, creatorId });
    const creator = getUserById(creatorId);
    return NextResponse.json({ project: { ...project, creator } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
