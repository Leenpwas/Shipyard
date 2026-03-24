'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import Link from 'next/link';
import Image from 'next/image';

export default function ProjectDetailPage({ params }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [resolvedParams, setResolvedParams] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => { params.then((p) => setResolvedParams(p)); }, [params]);
  useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [user, authLoading, router]);

  useEffect(() => {
    if (user && resolvedParams?.id) {
      Promise.all([
        fetch(`/api/projects/${resolvedParams.id}`).then((r) => r.json()),
        fetch(`/api/projects/${resolvedParams.id}/posts`).then((r) => r.json()),
      ]).then(([projData, postsData]) => {
        setProject(projData.project);
        setPosts(postsData.posts || []);
        setLoading(false);
      });
    }
  }, [user, resolvedParams]);

  const handleJoin = async () => {
    const isMember = project.memberIds?.includes(user.id);
    const res = await fetch(`/api/projects/${resolvedParams.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: isMember ? 'leave' : 'join', userId: user.id }),
    });
    if (res.ok) { const data = await res.json(); setProject((prev) => ({ ...prev, ...data.project })); }
  };

  const handleLike = async () => {
    const res = await fetch(`/api/projects/${resolvedParams.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', userId: user.id }),
    });
    if (res.ok) { const data = await res.json(); setProject((prev) => ({ ...prev, likes: data.project.likes, likedBy: data.project.likedBy })); }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosting(true);
    const res = await fetch(`/api/projects/${resolvedParams.id}/posts`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: user.id, content: newPost }),
    });
    if (res.ok) { const data = await res.json(); setPosts((prev) => [data.post, ...prev]); setNewPost(''); }
    setPosting(false);
  };

  if (authLoading || !user) return null;

  const isMember = project?.memberIds?.includes(user.id);
  const isCreator = project?.creatorId === user.id;
  const isLiked = project?.likedBy?.includes(user.id);
  const fundPct = project?.fundingGoal ? Math.round((project.fundingRaised / project.fundingGoal) * 100) : 0;
  const fmt = (v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
  const daysAgo = (d) => d ? Math.ceil((Date.now() - new Date(d).getTime()) / 86400000) : 0;
  const timeAgo = (d) => { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 60) return `${m}m`; const h = Math.floor(m / 60); return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`; };

  return (
    <AppShell>
      <div className="animate-fade-in">
        {loading ? (
          <div>
            <div className="skeleton" style={{ height: 200, borderRadius: 16, marginBottom: 16 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}
            </div>
          </div>
        ) : project ? (
          <>
            {/* Hero */}
            <div className="hero">
              <div className="hero-img">
                {project.coverImage ? (
                  <Image src={project.coverImage} alt={project.name} fill sizes="100vw" style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '5rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text-muted)' }}>{project.name?.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="hero-overlay" />
              <div className="hero-content">
                <h1>{project.name}</h1>
                <p className="hero-tagline">{project.tagline}</p>
                <div className="hero-row">
                  <span className="hero-creator">{project.creator?.displayName}</span>
                  <span className="hero-type">{project.projectType === 'remote' ? 'Remote' : project.projectType === 'in-person' ? 'In-Person' : 'Dual'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="actions">
              <button className={`btn ${isLiked ? 'btn-primary' : 'btn-secondary'}`} onClick={handleLike} style={{ fontSize: '0.8rem' }}>
                {isLiked ? '● Liked' : '○ Like'} · {project.likes}
              </button>
              {!isCreator && (
                <button className={`btn ${isMember ? 'btn-ghost' : 'btn-primary'}`} onClick={handleJoin}>
                  {isMember ? 'Joined' : 'Join'}
                </button>
              )}
              {isMember && (
                <Link href={`/projects/${resolvedParams.id}/chat`} className="btn btn-secondary">Chat</Link>
              )}
            </div>

            {/* Tabs */}
            <div className="tabs">
              {['dashboard', 'updates', 'about'].map((tab) => (
                <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab === 'dashboard' ? 'Stats' : tab === 'updates' ? `Updates · ${posts.length}` : 'About'}
                </button>
              ))}
            </div>

            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="dash animate-fade-in stagger-children">
                <div className="stat-grid">
                  <div className="stat progress-stat">
                    <span className="stat-label">Progress</span>
                    <span className="stat-number">{project.progress}%</span>
                    <div className="bar"><div className="bar-fill" style={{ width: `${project.progress}%` }} /></div>
                    <span className="stat-sub">{project.progress >= 80 ? 'Almost there' : project.progress >= 50 ? 'Good momentum' : 'Getting started'}</span>
                  </div>
                  <div className="stat streak-stat">
                    <span className="stat-label">Streak</span>
                    <span className="stat-number">{project.streak}<small>d</small></span>
                    <span className="stat-sub">Consecutive days</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Level</span>
                    <span className="stat-number">{project.level}</span>
                    <span className="stat-sub">{project.level >= 4 ? 'Expert' : project.level >= 3 ? 'Senior' : project.level >= 2 ? 'Active' : 'New'}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Started</span>
                    <span className="stat-date">{fmtDate(project.startDate)}</span>
                    <span className="stat-sub">{daysAgo(project.startDate)} days ago</span>
                  </div>
                </div>

                {/* Funding */}
                <div className="card funding-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                    <div>
                      <span className="stat-label">Funding</span>
                      <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{fmt(project.fundingRaised)}</div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>of {fmt(project.fundingGoal)}</span>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--lime)' }}>{fundPct}%</span>
                  </div>
                  <div className="bar bar-fund"><div className="bar-fill bar-fill-fund" style={{ width: `${fundPct}%` }} /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 8 }}>
                    <span>{project.memberIds?.length} backers</span>
                    <span>{project.fundingGoal - project.fundingRaised > 0 ? `${fmt(project.fundingGoal - project.fundingRaised)} to go` : 'Fully funded'}</span>
                  </div>
                </div>

                {/* People */}
                <div className="card">
                  <span className="stat-label" style={{ marginBottom: 12, display: 'block' }}>Team · {project.members?.length}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {project.members?.map((m) => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-hover)' }}>
                        <div className="avatar avatar-sm" style={m.id === project.creatorId ? { borderColor: 'var(--border-lime)', color: 'var(--lime)' } : {}}>{m.displayName?.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{m.displayName}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>@{m.username}</div>
                        </div>
                        {m.id === project.creatorId && <span className="badge badge-maker">Maker</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech */}
                <div className="card">
                  <span className="stat-label" style={{ marginBottom: 12, display: 'block' }}>Stack</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {project.techStack?.map((t) => <span key={t} className="tag tag-lime">{t}</span>)}
                  </div>
                </div>
              </div>
            )}

            {/* Updates */}
            {activeTab === 'updates' && (
              <div className="animate-fade-in">
                {(isCreator || isMember) && (
                  <form onSubmit={handlePost} style={{ marginBottom: 'var(--space-lg)' }}>
                    <textarea className="input-field" value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Share an update..." rows={3} style={{ resize: 'vertical', marginBottom: 8 }} />
                    <button type="submit" className="btn btn-primary btn-sm" disabled={posting || !newPost.trim()} style={{ float: 'right' }}>
                      {posting ? 'Posting...' : 'Post'}
                    </button>
                    <div style={{ clear: 'both' }} />
                  </form>
                )}
                <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 10, borderLeft: '2px solid var(--border-primary)', paddingLeft: 'var(--space-lg)', marginLeft: 6 }}>
                  {posts.map((post) => (
                    <div key={post.id} className="card" style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 'calc(-1 * var(--space-lg) - 7px)', top: 16, width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)', boxShadow: '0 0 8px var(--lime)' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar avatar-sm">{post.author?.displayName?.charAt(0)}</div>
                          <strong style={{ fontSize: '0.85rem' }}>{post.author?.displayName}</strong>
                          {post.authorId === project.creatorId && <span className="badge badge-maker">Maker</span>}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{timeAgo(post.createdAt)}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{post.content}</p>
                      <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{post.likes} likes</div>
                    </div>
                  ))}
                  {posts.length === 0 && <div className="empty-state"><h3>No updates yet</h3><p>Be the first to share an update.</p></div>}
                </div>
              </div>
            )}

            {/* About */}
            {activeTab === 'about' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="card">
                  <span className="stat-label" style={{ marginBottom: 12, display: 'block' }}>About</span>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{project.about || project.description}</p>
                </div>
                <div className="card">
                  <span className="stat-label" style={{ marginBottom: 12, display: 'block' }}>Details</span>
                  {[
                    ['Started', fmtDate(project.startDate)],
                    ['Type', project.projectType === 'remote' ? 'Remote' : project.projectType === 'in-person' ? 'In-Person' : 'Dual'],
                    ['Team', `${project.members?.length} people`],
                    ['Funding', `${fmt(project.fundingRaised)} / ${fmt(project.fundingGoal)}`],
                    ['Progress', `${project.progress}%`],
                    ['Streak', `${project.streak} days`],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-primary)', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
                      <span style={{ fontWeight: 600 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state"><h3>Project not found</h3><Link href="/explore" className="btn btn-primary">Explore</Link></div>
        )}
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          height: 220px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .hero-img { position: absolute; inset: 0; }
        .hero-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.15) 100%);
        }
        .hero-content { position: absolute; bottom: 0; left: 0; right: 0; padding: var(--space-lg); z-index: 2; }
        .hero-content h1 { font-size: 1.8rem; font-family: var(--font-heading); letter-spacing: -0.5px; margin-bottom: 2px; }
        .hero-tagline { font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
        .hero-row { display: flex; align-items: center; gap: 12px; }
        .hero-creator { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
        .hero-type {
          padding: 3px 10px; border-radius: var(--radius-full); font-size: 0.65rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.5px;
          background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6);
        }

        .actions { display: flex; gap: 8px; margin-bottom: 12px; }

        .tabs {
          display: flex; gap: 2px; margin-bottom: 16px;
          background: var(--bg-card); border-radius: var(--radius-md); padding: 3px;
          border: 1px solid var(--border-primary);
        }
        .tab {
          flex: 1; padding: 8px; border-radius: 8px; font-size: 0.8rem; font-weight: 500;
          color: var(--text-tertiary); text-align: center;
          transition: all var(--t-base) var(--ease-out);
        }
        .tab:hover { color: var(--text-primary); }
        .tab.active { background: var(--lime-ghost); color: var(--lime); }

        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }

        .stat {
          background: var(--bg-card); border: 1px solid var(--border-primary); border-radius: 14px;
          padding: var(--space-md) var(--space-lg); transition: all var(--t-base) var(--ease-out);
        }
        .stat:hover { border-color: var(--border-hover); }

        .stat-label {
          font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--text-tertiary);
        }

        .stat-number {
          display: block; font-family: var(--font-heading); font-size: 2rem; font-weight: 800;
          margin-top: 4px; line-height: 1; animation: countUp var(--t-slow) var(--ease-out) both;
        }
        .stat-number small { font-size: 0.9rem; font-weight: 500; color: var(--text-tertiary); }

        .stat-date {
          display: block; font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700;
          margin-top: 6px; animation: countUp var(--t-slow) var(--ease-out) both;
        }

        .stat-sub { display: block; font-size: 0.75rem; color: var(--text-tertiary); margin-top: 6px; }

        .progress-stat { border-color: rgba(200,255,0,0.1); background: rgba(200,255,0,0.02); }
        .progress-stat .stat-number { color: var(--lime); }

        .streak-stat { border-color: rgba(200,255,0,0.08); }

        .bar { height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; margin-top: 8px; }
        .bar-fill { height: 100%; background: var(--lime); border-radius: 3px; transition: width 1s var(--ease-out); }
        .bar-fund { height: 8px; border-radius: 4px; }
        .bar-fill-fund { background: linear-gradient(90deg, var(--lime-dim), var(--lime)); }

        .funding-card { margin-bottom: 10px; }
      `}</style>
    </AppShell>
  );
}
