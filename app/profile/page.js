'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetch(`/api/users/${user.id}`)
        .then((r) => r.json())
        .then((data) => {
          setProfile(data.user);
          setLoading(false);
        });
    }
  }, [user]);

  if (authLoading || !user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AppShell>
      <div className="animate-fade-in">
        {loading ? (
          <div>
            <div className="skeleton" style={{ height: 180, borderRadius: 16, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
          </div>
        ) : profile ? (
          <>
            {/* Profile Header */}
            <div className="profile-header card">
              <div className="avatar avatar-lg avatar-lime" style={{ margin: '0 auto var(--space-md)', fontSize: '1.5rem' }}>
                {profile.displayName?.charAt(0)}
              </div>
              <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', letterSpacing: '-0.5px' }}>
                {profile.displayName}
              </h2>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>
                @{profile.username}
              </p>
              {profile.bio && (
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 300, margin: '0 auto var(--space-lg)' }}>
                  {profile.bio}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2xl)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                    {profile.ownedProjects?.length || 0}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                    {profile.joinedProjects?.length || 0}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Communities</div>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)' }}>
                  My Projects
                </span>
                <Link href="/projects/new" className="btn btn-primary btn-sm">New Project</Link>
              </div>
              <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {profile.ownedProjects?.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`} className="card" style={{ display: 'flex', gap: 14, padding: 14, textDecoration: 'none' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--bg-elevated)' }}>
                      {project.coverImage ? (
                        <Image src={project.coverImage} alt={project.name} fill sizes="56px" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                          {project.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 2 }}>{project.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {project.description}
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        <span>{project.likes} likes</span>
                        <span>{project.memberIds?.length} members</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Joined */}
            {profile.joinedProjects?.length > 0 && (
              <div style={{ marginTop: 'var(--space-xl)' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', display: 'block', marginBottom: 12 }}>
                  Communities
                </span>
                <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {profile.joinedProjects?.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`} className="card" style={{ display: 'flex', gap: 14, padding: 14, textDecoration: 'none' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--bg-elevated)' }}>
                        {project.coverImage ? (
                          <Image src={project.coverImage} alt={project.name} fill sizes="44px" style={{ objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                            {project.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{project.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{project.memberIds?.length} members</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: 'var(--space-xl)', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}
            >
              Sign Out
            </button>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
