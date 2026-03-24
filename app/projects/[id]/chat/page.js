'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';

export default function ChatPage({ params }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [project, setProject] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [resolvedParams, setResolvedParams] = useState(null);

  useEffect(() => { params.then((p) => setResolvedParams(p)); }, [params]);
  useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [user, authLoading, router]);

  const fetchMessages = async () => {
    if (!resolvedParams?.id) return;
    const res = await fetch(`/api/projects/${resolvedParams.id}/chat`);
    const data = await res.json();
    setMessages(data.messages || []);
  };

  useEffect(() => {
    if (user && resolvedParams?.id) {
      fetch(`/api/projects/${resolvedParams.id}`).then((r) => r.json()).then((d) => setProject(d.project));
      fetchMessages().then(() => setLoading(false));
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [user, resolvedParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch(`/api/projects/${resolvedParams.id}/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: user.id, content: input }),
    });
    if (res.ok) { setInput(''); fetchMessages(); }
  };

  if (authLoading || !user) return null;

  const fmtTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <AppShell>
      <div className="chat-wrap animate-fade-in">
        {/* Header */}
        <div className="chat-header">
          <button onClick={() => router.back()} style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>←</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{project?.name || 'Chat'}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{project?.memberIds?.length || 0} members</div>
          </div>
          <div style={{ width: 24 }} />
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {loading ? (
            <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Loading...</div>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No messages yet. Say something.</div>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.authorId === user?.id;
              const isMaker = msg.authorId === project?.creatorId;
              return (
                <div key={msg.id} className={`msg ${isOwn ? 'msg-own' : ''}`}>
                  {!isOwn && (
                    <div className="msg-meta">
                      <span className="msg-author">{msg.author?.displayName}</span>
                      {isMaker && <span className="badge badge-maker">Maker</span>}
                    </div>
                  )}
                  <div className={`msg-bubble ${isOwn ? 'own' : ''}`}>
                    {msg.content}
                  </div>
                  <span className="msg-time">{fmtTime(msg.createdAt)}</span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="chat-input" onSubmit={handleSend}>
          <input
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            style={{ borderRadius: 'var(--radius-full)', flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={!input.trim()} style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px' }}>
            Send
          </button>
        </form>
      </div>

      <style jsx>{`
        .chat-wrap {
          display: flex;
          flex-direction: column;
          height: calc(100vh - var(--bottom-nav-height) - 32px);
          margin: calc(-1 * var(--space-lg)) calc(-1 * var(--space-md));
          padding: 0 var(--space-md);
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: var(--space-md) 0;
          border-bottom: 1px solid var(--border-primary);
          flex-shrink: 0;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-md) 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .msg {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 80%;
          animation: slideUp var(--t-base) var(--ease-out) both;
        }

        .msg.msg-own {
          align-self: flex-end;
          align-items: flex-end;
        }

        .msg-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 3px;
        }

        .msg-author {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-tertiary);
        }

        .msg-bubble {
          padding: 10px 14px;
          border-radius: 14px 14px 14px 4px;
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .msg-bubble.own {
          background: var(--lime-ghost);
          border-color: var(--border-lime);
          border-radius: 14px 14px 4px 14px;
          color: var(--text-primary);
        }

        .msg-time {
          font-size: 0.6rem;
          color: var(--text-muted);
          margin-top: 3px;
        }

        .chat-input {
          display: flex;
          gap: 8px;
          padding: var(--space-sm) 0 var(--space-md);
          flex-shrink: 0;
          border-top: 1px solid var(--border-primary);
        }
      `}</style>
    </AppShell>
  );
}
