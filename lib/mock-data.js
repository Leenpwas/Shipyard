// ============================================
// ShipYard — Mock Data Store
// In-memory data that simulates a real database
// ============================================

let users = [
  {
    id: 'user-1',
    username: 'sarah_dev',
    displayName: 'Sarah Chen',
    email: 'sarah@example.com',
    password: 'password123',
    bio: 'Full-stack dev obsessed with beautiful UIs. Building tools that spark joy.',
    avatarUrl: null,
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: 'user-2',
    username: 'alex_maker',
    displayName: 'Alex Rivera',
    email: 'alex@example.com',
    password: 'password123',
    bio: 'Indie hacker shipping fast. Currently building AI-powered apps.',
    avatarUrl: null,
    createdAt: '2025-11-05T14:30:00Z',
  },
  {
    id: 'user-3',
    username: 'priya_codes',
    displayName: 'Priya Patel',
    email: 'priya@example.com',
    password: 'password123',
    bio: 'Backend engineer turned solopreneur. Rust & Go enthusiast.',
    avatarUrl: null,
    createdAt: '2025-12-10T09:15:00Z',
  },
  {
    id: 'user-4',
    username: 'marcus_ui',
    displayName: 'Marcus Johnson',
    email: 'marcus@example.com',
    password: 'password123',
    bio: 'Design engineer. Passionate about motion design and micro-interactions.',
    avatarUrl: null,
    createdAt: '2026-01-03T11:00:00Z',
  },
];

let projects = [
  {
    id: 'proj-1',
    name: 'PixelForge',
    tagline: 'AI-powered image editing for the future',
    description: 'An AI-powered image editor that lets designers generate, remix, and enhance visuals in real-time. Built with a custom WebGL pipeline for buttery smooth performance.',
    coverImage: '/cover-pixelforge.png',
    techStack: ['React', 'WebGL', 'Python', 'FastAPI', 'Redis'],
    creatorId: 'user-1',
    memberIds: ['user-1', 'user-2', 'user-4'],
    likes: 142,
    likedBy: ['user-2', 'user-3', 'user-4'],
    status: 'active',
    projectType: 'remote',
    startDate: '2025-12-01',
    progress: 72,
    streak: 14,
    level: 3,
    fundingGoal: 25000,
    fundingRaised: 18200,
    about: 'PixelForge is reimagining how designers interact with AI. Our mission is to make professional-grade image editing accessible to everyone through intelligent automation and real-time collaboration.',
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'DeployBot',
    tagline: 'Ship code without leaving Slack',
    description: 'A Slack bot that deploys your code, runs your tests, and notifies your team — all without leaving the chat. One-click rollbacks included.',
    coverImage: '/cover-deploybot.png',
    techStack: ['Node.js', 'Docker', 'AWS Lambda', 'Slack API'],
    creatorId: 'user-2',
    memberIds: ['user-2', 'user-1'],
    likes: 89,
    likedBy: ['user-1', 'user-3'],
    status: 'active',
    projectType: 'remote',
    startDate: '2026-01-15',
    progress: 58,
    streak: 7,
    level: 2,
    fundingGoal: 10000,
    fundingRaised: 4500,
    about: 'DeployBot was born from the frustration of context-switching during deployment. We believe shipping code should be as easy as sending a message.',
    createdAt: '2026-01-15T08:30:00Z',
  },
  {
    id: 'proj-3',
    name: 'MoodBoard',
    tagline: 'Collaborative design, redefined',
    description: 'A collaborative mood boarding tool for design teams. Drag, drop, and arrange images, colors, and typography with real-time sync across your team.',
    coverImage: '/cover-moodboard.png',
    techStack: ['SvelteKit', 'Supabase', 'PostgreSQL', 'Cloudflare R2'],
    creatorId: 'user-4',
    memberIds: ['user-4', 'user-1', 'user-3'],
    likes: 204,
    likedBy: ['user-1', 'user-2', 'user-3'],
    status: 'active',
    projectType: 'dual',
    startDate: '2026-02-01',
    progress: 45,
    streak: 21,
    level: 2,
    fundingGoal: 15000,
    fundingRaised: 9800,
    about: 'MoodBoard brings the tactile experience of physical mood boards into the digital world. Designed for cross-functional teams who believe great products start with great inspiration.',
    createdAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'proj-4',
    name: 'CrateDB CLI',
    tagline: 'Your database, your terminal',
    description: 'A blazingly fast CLI tool for managing your PostgreSQL databases. Schema diffing, migration generation, and seed data — all from your terminal.',
    coverImage: '/cover-cratedb.png',
    techStack: ['Rust', 'PostgreSQL', 'Tokio'],
    creatorId: 'user-3',
    memberIds: ['user-3', 'user-2'],
    likes: 67,
    likedBy: ['user-2', 'user-4'],
    status: 'active',
    projectType: 'in-person',
    startDate: '2026-02-20',
    progress: 35,
    streak: 5,
    level: 1,
    fundingGoal: 5000,
    fundingRaised: 1200,
    about: 'CrateDB CLI is the tool I wished I had when managing dozens of PostgreSQL instances. Built in Rust for maximum performance and reliability.',
    createdAt: '2026-02-20T15:45:00Z',
  },
  {
    id: 'proj-5',
    name: 'Lyric Studio',
    tagline: 'Where AI meets melody',
    description: 'An AI-assisted songwriting tool that helps musicians brainstorm lyrics, find rhymes, and structure their songs. Features real-time collaboration and version history.',
    coverImage: '/cover-lyricstudio.png',
    techStack: ['Next.js', 'OpenAI API', 'MongoDB', 'Vercel'],
    creatorId: 'user-2',
    memberIds: ['user-2', 'user-3', 'user-4', 'user-1'],
    likes: 315,
    likedBy: ['user-1', 'user-3', 'user-4'],
    status: 'active',
    projectType: 'remote',
    startDate: '2026-03-01',
    progress: 88,
    streak: 19,
    level: 4,
    fundingGoal: 30000,
    fundingRaised: 27500,
    about: 'Lyric Studio bridges the gap between AI and human creativity. We help songwriters overcome writer\'s block by providing intelligent suggestions while keeping the artist\'s unique voice intact.',
    createdAt: '2026-03-01T09:00:00Z',
  },
];

let posts = [
  {
    id: 'post-1',
    projectId: 'proj-1',
    authorId: 'user-1',
    content: 'Just shipped the new real-time preview feature. You can now see AI-generated edits before applying them. The latency is under 200ms.',
    imageUrl: null,
    likes: 48,
    likedBy: ['user-2', 'user-3'],
    createdAt: '2026-03-15T10:30:00Z',
  },
  {
    id: 'post-2',
    projectId: 'proj-1',
    authorId: 'user-1',
    content: 'Week 1 update: Set up the WebGL rendering pipeline. Took 3 days to figure out the shader compilation but it was totally worth it. Here is a comparison of before/after performance.',
    imageUrl: null,
    likes: 35,
    likedBy: ['user-4'],
    createdAt: '2025-12-08T14:00:00Z',
  },
  {
    id: 'post-3',
    projectId: 'proj-2',
    authorId: 'user-2',
    content: 'DeployBot v2 is live. Added one-click rollbacks and parallel test running. Deployment times went from 8 min down to 2 min.',
    imageUrl: null,
    likes: 72,
    likedBy: ['user-1', 'user-3', 'user-4'],
    createdAt: '2026-03-10T16:00:00Z',
  },
  {
    id: 'post-4',
    projectId: 'proj-3',
    authorId: 'user-4',
    content: 'Launched the collaborative cursor feature today! You can now see exactly where your teammates are working on the board in real time. It feels incredibly smooth.',
    imageUrl: null,
    likes: 93,
    likedBy: ['user-1', 'user-2', 'user-3'],
    createdAt: '2026-03-12T11:15:00Z',
  },
  {
    id: 'post-5',
    projectId: 'proj-5',
    authorId: 'user-2',
    content: 'Added rhyme suggestions to the AI engine. It now considers syllable count and stress patterns for better-sounding lyrics. Songwriters in our beta are loving it.',
    imageUrl: null,
    likes: 128,
    likedBy: ['user-1', 'user-3', 'user-4'],
    createdAt: '2026-03-18T08:00:00Z',
  },
  {
    id: 'post-6',
    projectId: 'proj-4',
    authorId: 'user-3',
    content: 'First public release of CrateDB CLI. You can now run crate diff to see exactly what changed in your schema. Feedback welcome.',
    imageUrl: null,
    likes: 41,
    likedBy: ['user-2'],
    createdAt: '2026-03-14T20:00:00Z',
  },
  {
    id: 'post-7',
    projectId: 'proj-3',
    authorId: 'user-4',
    content: 'Starting the MoodBoard journey. Day 0 — just set up the SvelteKit project with Supabase. Thinking about the drag-and-drop UX flow.',
    imageUrl: null,
    likes: 56,
    likedBy: ['user-1', 'user-3'],
    createdAt: '2026-02-01T12:30:00Z',
  },
];

let messages = [
  {
    id: 'msg-1',
    projectId: 'proj-1',
    authorId: 'user-2',
    content: 'Sarah this is incredible! How did you handle the WebGL context loss on mobile?',
    createdAt: '2026-03-15T11:00:00Z',
  },
  {
    id: 'msg-2',
    projectId: 'proj-1',
    authorId: 'user-1',
    content: 'Thanks Alex! I added a context restoration handler that re-compiles the shaders. It adds about 50ms but the UX is seamless.',
    createdAt: '2026-03-15T11:05:00Z',
  },
  {
    id: 'msg-3',
    projectId: 'proj-1',
    authorId: 'user-4',
    content: 'Love the preview feature. Would be amazing if you could add a split-view comparison mode too!',
    createdAt: '2026-03-15T11:10:00Z',
  },
  {
    id: 'msg-4',
    projectId: 'proj-5',
    authorId: 'user-3',
    content: 'The rhyme engine is surprisingly good! I tested it with some Hindi words too and it picked up on the phonetics.',
    createdAt: '2026-03-18T09:00:00Z',
  },
  {
    id: 'msg-5',
    projectId: 'proj-5',
    authorId: 'user-2',
    content: 'Whoa really? I didn\'t even train it on Hindi. That must be the multilingual tokenizer doing its thing.',
    createdAt: '2026-03-18T09:05:00Z',
  },
  {
    id: 'msg-6',
    projectId: 'proj-3',
    authorId: 'user-1',
    content: 'Marcus, the real-time cursors are so smooth! What library are you using for the delta syncing?',
    createdAt: '2026-03-12T12:00:00Z',
  },
  {
    id: 'msg-7',
    projectId: 'proj-3',
    authorId: 'user-4',
    content: 'I\'m using Supabase Realtime channels with custom presence tracking. It auto-handles reconnection too.',
    createdAt: '2026-03-12T12:05:00Z',
  },
];

// ── Helper Functions ──

let nextId = 100;
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${++nextId}`;
}

// ── Users ──
export function getUsers() {
  return [...users];
}

export function getUserById(id) {
  return users.find((u) => u.id === id) || null;
}

export function getUserByEmail(email) {
  return users.find((u) => u.email === email) || null;
}

export function createUser({ username, displayName, email, password, bio }) {
  const user = {
    id: generateId('user'),
    username,
    displayName,
    email,
    password,
    bio: bio || '',
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

// ── Projects ──
export function getProjects() {
  return [...projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getProjectById(id) {
  return projects.find((p) => p.id === id) || null;
}

export function getProjectsByCreator(userId) {
  return projects.filter((p) => p.creatorId === userId);
}

export function getProjectsByMember(userId) {
  return projects.filter((p) => p.memberIds.includes(userId));
}

export function createProject({ name, description, techStack, creatorId, projectType, fundingGoal }) {
  const project = {
    id: generateId('proj'),
    name,
    tagline: description?.slice(0, 50) + '...',
    description,
    coverImage: null,
    techStack: techStack || [],
    creatorId,
    memberIds: [creatorId],
    likes: 0,
    likedBy: [],
    status: 'active',
    projectType: projectType || 'remote',
    startDate: new Date().toISOString().split('T')[0],
    progress: 0,
    streak: 0,
    level: 1,
    fundingGoal: fundingGoal || 0,
    fundingRaised: 0,
    about: description,
    createdAt: new Date().toISOString(),
  };
  projects.push(project);
  return project;
}

export function toggleProjectLike(projectId, userId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;
  const idx = project.likedBy.indexOf(userId);
  if (idx > -1) {
    project.likedBy.splice(idx, 1);
    project.likes--;
  } else {
    project.likedBy.push(userId);
    project.likes++;
  }
  return project;
}

export function joinProject(projectId, userId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;
  if (!project.memberIds.includes(userId)) {
    project.memberIds.push(userId);
  }
  return project;
}

export function leaveProject(projectId, userId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;
  project.memberIds = project.memberIds.filter((id) => id !== userId);
  return project;
}

// ── Posts ──
export function getPostsByProject(projectId) {
  return posts
    .filter((p) => p.projectId === projectId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getAllPosts() {
  return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function createPost({ projectId, authorId, content }) {
  const post = {
    id: generateId('post'),
    projectId,
    authorId,
    content,
    imageUrl: null,
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
  };
  posts.push(post);
  return post;
}

export function togglePostLike(postId, userId) {
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;
  const idx = post.likedBy.indexOf(userId);
  if (idx > -1) {
    post.likedBy.splice(idx, 1);
    post.likes--;
  } else {
    post.likedBy.push(userId);
    post.likes++;
  }
  return post;
}

// ── Messages ──
export function getMessagesByProject(projectId) {
  return messages
    .filter((m) => m.projectId === projectId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export function createMessage({ projectId, authorId, content }) {
  const message = {
    id: generateId('msg'),
    projectId,
    authorId,
    content,
    createdAt: new Date().toISOString(),
  };
  messages.push(message);
  return message;
}
