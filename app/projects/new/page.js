'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';

export default function NewProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [projectType, setProjectType] = useState('remote');
  const [fundingGoal, setFundingGoal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        techStack: techStack.split(',').map((s) => s.trim()).filter(Boolean),
        creatorId: user.id,
        projectType,
        fundingGoal: parseInt(fundingGoal) || 0,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/projects/${data.project.id}`);
    }
    setLoading(false);
  };

  return (
    <AppShell>
      <div className="animate-fade-in">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: 4, letterSpacing: '-0.5px' }}>New Project</h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 'var(--space-xl)' }}>Ship something new</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" required />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What are you building?" rows={4} required style={{ resize: 'vertical' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Tech Stack</label>
            <input className="input-field" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, Node.js, PostgreSQL" />
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>Comma separated</p>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['remote', 'in-person', 'dual'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setProjectType(t)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 500,
                    background: projectType === t ? 'var(--lime)' : 'var(--bg-card)',
                    color: projectType === t ? '#000' : 'var(--text-tertiary)',
                    border: `1px solid ${projectType === t ? 'var(--lime)' : 'var(--border-primary)'}`,
                    transition: 'all var(--t-base) var(--ease-out)',
                    textTransform: 'capitalize',
                  }}
                >
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Funding Goal</label>
            <input className="input-field" type="number" value={fundingGoal} onChange={(e) => setFundingGoal(e.target.value)} placeholder="e.g. 10000" />
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>USD, optional</p>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()} style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
