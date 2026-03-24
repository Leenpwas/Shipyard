'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ExplorePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/projects')
        .then((r) => r.json())
        .then((data) => {
          setProjects(data.projects || []);
          setLoading(false);
        });
    }
  }, [user]);

  // Track which reel is visible
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.index);
            if (!isNaN(idx)) setCurrentIndex(idx);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    container.querySelectorAll('.reel').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [projects, loading]);

  const handleLike = async (e, proj) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await fetch(`/api/projects/${proj.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', userId: user.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setProjects((prev) =>
        prev.map((p) => p.id === proj.id ? { ...p, likes: data.project.likes, likedBy: data.project.likedBy } : p)
      );
    }
  };

  if (authLoading || !user) return null;

  return (
    <>
      <div className="reels-container" ref={containerRef}>
        {loading ? (
          <div className="reel reel-loading">
            <div className="reel-loading-text">Loading projects...</div>
          </div>
        ) : (
          projects.map((project, index) => {
            const isLiked = project.likedBy?.includes(user.id);
            return (
              <div key={project.id} className="reel" data-index={index}>
                {/* Full-screen cover image */}
                <div className="reel-bg">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.name}
                      fill
                      sizes="100vw"
                      style={{ objectFit: 'cover' }}
                      priority={index < 2}
                    />
                  ) : (
                    <div className="reel-bg-fallback">
                      <span>{project.name?.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Gradient overlay */}
                <div className="reel-overlay" />

                {/* Right side — action buttons */}
                <div className="reel-actions">
                  <button
                    className={`reel-action-btn ${isLiked ? 'active' : ''}`}
                    onClick={(e) => handleLike(e, project)}
                  >
                    <span className="action-icon">{isLiked ? '●' : '○'}</span>
                    <span className="action-label">{project.likes}</span>
                  </button>

                  <Link href={`/projects/${project.id}/chat`} className="reel-action-btn">
                    <span className="action-icon">⊡</span>
                    <span className="action-label">Chat</span>
                  </Link>

                  <div className="reel-action-btn">
                    <span className="action-icon">{project.memberIds?.length}</span>
                    <span className="action-label">Team</span>
                  </div>

                  {/* Progress ring */}
                  <div className="reel-progress-ring">
                    <svg viewBox="0 0 44 44">
                      <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                      <circle
                        cx="22" cy="22" r="18" fill="none"
                        stroke="var(--lime)"
                        strokeWidth="2.5"
                        strokeDasharray={`${project.progress * 1.13} 113`}
                        strokeLinecap="round"
                        transform="rotate(-90 22 22)"
                        style={{ filter: 'drop-shadow(0 0 4px var(--lime))' }}
                      />
                    </svg>
                    <span className="ring-pct">{project.progress}%</span>
                  </div>
                </div>

                {/* Bottom content */}
                <div className="reel-bottom">
                  <div className="reel-creator-row">
                    <div className="avatar avatar-sm" style={{ borderColor: 'var(--border-lime)', color: 'var(--lime)' }}>
                      {project.creator?.displayName?.charAt(0)}
                    </div>
                    <span className="reel-creator-name">{project.creator?.displayName}</span>
                    <span className="reel-type-pill">
                      {project.projectType === 'remote' ? 'Remote' : project.projectType === 'in-person' ? 'In-Person' : 'Dual'}
                    </span>
                  </div>

                  <h2 className="reel-title">{project.name}</h2>
                  <p className="reel-desc">{project.description}</p>

                  <div className="reel-tags">
                    {project.techStack?.slice(0, 4).map((t) => (
                      <span key={t} className="reel-tag">{t}</span>
                    ))}
                  </div>

                  <Link href={`/projects/${project.id}`} className="reel-cta">
                    View Project
                  </Link>
                </div>

                {/* Dots indicator */}
                <div className="reel-dots">
                  {projects.map((_, i) => (
                    <div key={i} className={`reel-dot ${i === currentIndex ? 'active' : ''}`} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom nav — we need to render it ourselves since we're not using AppShell layout */}
      <nav className="bottom-nav">
        <Link href="/" className="nav-item" aria-label="Feed"><span className="nav-icon">⌂</span></Link>
        <Link href="/explore" className="nav-item active" aria-label="Explore"><span className="nav-icon">◎</span></Link>
        <Link href="/projects/new" className="nav-item" aria-label="New"><span className="nav-icon">✦</span></Link>
        <Link href="/profile" className="nav-item" aria-label="Profile"><span className="nav-icon">○</span></Link>
      </nav>

      <style jsx>{`
        .reels-container {
          position: fixed;
          inset: 0;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          -webkit-overflow-scrolling: touch;
          z-index: 10;
          background: #000;
        }

        .reel {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .reel-loading {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reel-loading-text {
          color: var(--text-tertiary);
          font-size: 0.9rem;
        }

        /* ── Background ── */
        .reel-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .reel-bg :global(img) {
          transition: transform 0.8s var(--ease-out);
        }

        .reel-bg-fallback {
          width: 100%;
          height: 100%;
          background: var(--bg-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8rem;
          font-family: var(--font-heading);
          font-weight: 900;
          color: rgba(255,255,255,0.03);
        }

        /* ── Overlay ── */
        .reel-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.92) 0%,
            rgba(0, 0, 0, 0.5) 35%,
            rgba(0, 0, 0, 0.05) 55%,
            rgba(0, 0, 0, 0.15) 100%
          );
        }

        /* ── Right Actions (TikTok style) ── */
        .reel-actions {
          position: absolute;
          right: 12px;
          bottom: 160px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .reel-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          color: rgba(255,255,255,0.7);
          transition: all var(--t-base) var(--ease-out);
          cursor: pointer;
        }

        .reel-action-btn:hover {
          color: #fff;
          transform: scale(1.1);
        }

        .reel-action-btn.active {
          color: var(--lime);
        }

        .reel-action-btn.active .action-icon {
          filter: drop-shadow(0 0 8px var(--lime));
        }

        .action-icon {
          font-size: 1.5rem;
          font-weight: 700;
          transition: all var(--t-fast);
        }

        .action-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* ── Progress Ring ── */
        .reel-progress-ring {
          position: relative;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reel-progress-ring svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .ring-pct {
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--lime);
          font-family: var(--font-heading);
        }

        /* ── Bottom Content ── */
        .reel-bottom {
          position: relative;
          z-index: 2;
          padding: 0 16px 100px 16px;
          max-width: 85%;
          animation: slideUp var(--t-slow) var(--ease-out) both;
        }

        .reel-creator-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .reel-creator-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
        }

        .reel-type-pill {
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.55rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
        }

        .reel-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 8px;
          color: #fff;
        }

        .reel-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .reel-tags {
          display: flex;
          gap: 6px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .reel-tag {
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 500;
          background: rgba(200, 255, 0, 0.06);
          color: var(--lime);
          border: 1px solid rgba(200, 255, 0, 0.12);
        }

        .reel-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 24px;
          border-radius: var(--radius-full);
          background: var(--lime);
          color: #000;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          transition: all var(--t-base) var(--ease-out);
          letter-spacing: 0.3px;
        }

        .reel-cta:hover {
          box-shadow: 0 0 30px rgba(200, 255, 0, 0.3);
          transform: translateY(-1px);
        }

        .reel-cta:active {
          transform: scale(0.97);
        }

        /* ── Dots Indicator ── */
        .reel-dots {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .reel-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          transition: all var(--t-base) var(--ease-out);
        }

        .reel-dot.active {
          height: 16px;
          border-radius: 2px;
          background: var(--lime);
          box-shadow: 0 0 8px var(--lime);
        }

        /* ── Ensure bottom nav floats over reels ── */
        :global(.bottom-nav) {
          z-index: 20;
        }
      `}</style>
    </>
  );
}
