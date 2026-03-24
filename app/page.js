'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import Link from 'next/link';

export default function FeedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/feed')
        .then((r) => r.json())
        .then((data) => {
          setPosts(data.posts || []);
          setLoading(false);
        });
    }
  }, [user]);

  if (authLoading || !user) return null;

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  const handleLike = async (postId) => {
    const res = await fetch(`/api/projects/${posts.find(p => p.id === postId)?.projectId}/posts`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, userId: user.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: data.post.likes, likedBy: data.post.likedBy } : p)));
    }
  };

  return (
    <AppShell>
      <div className="animate-fade-in">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: 4, letterSpacing: '-0.5px' }}>Feed</h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 'var(--space-xl)' }}>What makers are building</p>

        {loading ? (
          <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />
            ))}
          </div>
        ) : (
          <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.map((post) => (
              <div key={post.id} className="card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                {/* Project label */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                  <Link href={`/projects/${post.projectId}`} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--lime)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    {post.project?.name || 'Project'}
                  </Link>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{timeAgo(post.createdAt)}</span>
                </div>

                {/* Content */}
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
                  {post.content}
                </p>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="avatar avatar-sm">{post.author?.displayName?.charAt(0)}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{post.author?.displayName}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{
                        fontSize: '0.8rem',
                        color: post.likedBy?.includes(user.id) ? 'var(--lime)' : 'var(--text-tertiary)',
                        display: 'flex', alignItems: 'center', gap: 4,
                        transition: 'all var(--t-fast)',
                      }}
                    >
                      {post.likedBy?.includes(user.id) ? '●' : '○'} {post.likes}
                    </button>
                    <Link href={`/projects/${post.projectId}`} style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
