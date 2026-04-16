// File: client/src/pages/LandingPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-time Kanban',
    description: 'Drag and drop tasks across columns instantly. Every change syncs to your whole team via WebSockets — no refresh needed.',
    color: '#6c63ff',
  },
  {
    icon: '📅',
    title: 'Due Dates & Priorities',
    description: 'Set deadlines and mark tasks as Low, Medium, or High priority. Overdue cards are automatically highlighted so nothing falls through the cracks.',
    color: '#f5a623',
  },
  {
    icon: '👥',
    title: 'Team Collaboration',
    description: 'Invite teammates by email. They get a beautiful invite link, join with one click, and see the board live alongside you.',
    color: '#4caf50',
  },
  {
    icon: '🔒',
    title: 'Secure by Default',
    description: 'JWT authentication, bcrypt password hashing, and board-level access control. Your data stays yours.',
    color: '#e91e63',
  },
  {
    icon: '🚀',
    title: 'Always Available',
    description: 'Deployed on Render with MongoDB Atlas. 99.9% uptime so your team can work any time, anywhere.',
    color: '#00bcd4',
  },
  {
    icon: '💳',
    title: 'Simple Pricing',
    description: 'Start free forever. Upgrade to Pro when your team needs unlimited boards and priority support.',
    color: '#a855f7',
  },
];

const KANBAN_PREVIEW = {
  todo: ['Design landing page', 'Set up CI/CD pipeline'],
  inprogress: ['Build invite system', 'Stripe integration'],
  done: ['Realtime sync ✓', 'Auth & security ✓'],
};

const PREVIEW_COLS = [
  { id: 'todo',       label: 'To Do',       color: '#6c63ff' },
  { id: 'inprogress', label: 'In Progress',  color: '#f5a623' },
  { id: 'done',       label: 'Done',         color: '#4caf50' },
];

const LandingPage = () => {
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleUpgrade = async () => {
    setLoadingCheckout(true);
    try {
      const { data } = await api.post('/payments/create-checkout');
      window.location.href = data.url;
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/register';
      } else {
        alert(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div style={{ background: '#0d0f14', minHeight: '100vh', color: '#e8eaf0', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.98)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .land-cta-btn { transition: transform 0.2s, box-shadow 0.2s; }
        .land-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(108,99,255,0.5) !important; }
        .feature-card { transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.3) !important; }
        .pricing-card { transition: transform 0.2s, box-shadow 0.2s; }
        .pricing-card:hover { transform: translateY(-4px); }
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #e8eaf0 !important; }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 32px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(13,15,20,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Mono, monospace', fontWeight: 700, color: '#fff', fontSize: 13,
            boxShadow: '0 4px 16px rgba(108,99,255,0.4)',
          }}>AF</div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 17, color: '#e8eaf0', letterSpacing: '-0.3px' }}>
            AgileFlow
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" className="nav-link" style={{ color: '#8b90a7', textDecoration: 'none', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Features</a>
          <a href="#pricing" className="nav-link" style={{ color: '#8b90a7', textDecoration: 'none', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Pricing</a>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login" style={{
              padding: '8px 18px', borderRadius: 10, textDecoration: 'none',
              color: '#8b90a7', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500,
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s',
            }}>Login</Link>
            <Link to="/register" style={{
              padding: '8px 18px', borderRadius: 10, textDecoration: 'none',
              color: '#fff', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 600,
              background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
              boxShadow: '0 4px 16px rgba(108,99,255,0.3)',
            }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ paddingTop: 140, paddingBottom: 100, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', padding: '0 24px', animation: 'fadeInUp 0.6s ease forwards' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: 'rgba(108,99,255,0.12)',
            border: '1px solid rgba(108,99,255,0.3)',
            marginBottom: 28,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6c63ff', boxShadow: '0 0 6px #6c63ff', animation: 'pulse 2s ease infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6c63ff', fontFamily: 'Space Mono, monospace', letterSpacing: '0.05em' }}>
              REAL-TIME KANBAN
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(40px, 6vw, 68px)',
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-2px', margin: '0 0 20px',
            background: 'linear-gradient(135deg, #e8eaf0 30%, #6c63ff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Ship faster,<br />together.
          </h1>

          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 18, color: '#8b90a7', lineHeight: 1.7,
            margin: '0 0 40px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
          }}>
            The Kanban board that gets out of your way. Real-time sync, team invites, due dates, and Stripe billing — all in one open-source app.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="land-cta-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 14, textDecoration: 'none',
              background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
              color: '#fff', fontSize: 16, fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 24px rgba(108,99,255,0.4)',
            }}>
              Start for free →
            </Link>
            <a href="#features" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 14, textDecoration: 'none',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e8eaf0', fontSize: 16, fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
            }}>
              See features
            </a>
          </div>
        </div>

        {/* Mini Kanban preview */}
        <div style={{
          marginTop: 72, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto',
          padding: '0 24px',
          animation: 'fadeInUp 0.8s ease 0.2s forwards', opacity: 0,
        }}>
          <div style={{
            background: '#13161e', borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '20px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          }}>
            {/* Window chrome */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
              <div style={{
                flex: 1, height: 24, borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                marginLeft: 8, display: 'flex', alignItems: 'center',
                padding: '0 10px',
              }}>
                <span style={{ fontSize: 11, color: '#555a72', fontFamily: 'Space Mono, monospace' }}>
                  app.agileflow.io/board/sprint-1
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {PREVIEW_COLS.map(col => (
                <div key={col.id} style={{ background: '#0d0f14', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ height: 2, background: col.color }} />
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.color, boxShadow: `0 0 6px ${col.color}` }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#e8eaf0' }}>{col.label}</span>
                    <span style={{
                      marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                      padding: '1px 6px', borderRadius: 4,
                      background: `${col.color}20`, color: col.color,
                      fontFamily: 'Space Mono, monospace',
                    }}>{KANBAN_PREVIEW[col.id].length}</span>
                  </div>
                  <div style={{ padding: 8 }}>
                    {KANBAN_PREVIEW[col.id].map((task, i) => (
                      <div key={i} style={{
                        background: '#13161e', borderRadius: 8, padding: '8px 10px',
                        marginBottom: i < KANBAN_PREVIEW[col.id].length - 1 ? 6 : 0,
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontSize: 11, color: '#8b90a7',
                      }}>{task}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6c63ff', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>FEATURES</p>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', margin: 0, color: '#e8eaf0' }}>
            Everything your team needs
          </h2>
          <p style={{ color: '#8b90a7', fontSize: 16, marginTop: 12, fontFamily: 'Inter, sans-serif' }}>
            Built for real teams. No bloat, no learning curve.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              style={{
                background: '#13161e',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20, padding: 28,
                animation: `fadeInUp 0.5s ease ${i * 0.07}s forwards`, opacity: 0,
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14, marginBottom: 20,
                background: `${f.color}15`, border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 700, color: '#e8eaf0', margin: '0 0 10px', letterSpacing: '-0.2px' }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#8b90a7', lineHeight: 1.65, margin: 0 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" style={{ padding: '100px 24px', background: 'rgba(108,99,255,0.03)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6c63ff', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Space Mono, monospace', marginBottom: 12 }}>PRICING</p>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', margin: 0, color: '#e8eaf0' }}>
              Simple, honest pricing
            </h2>
            <p style={{ color: '#8b90a7', fontSize: 16, marginTop: 12, fontFamily: 'Inter, sans-serif' }}>
              Start free. Pay only when you need more.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
            {/* Free */}
            <div className="pricing-card" style={{
              background: '#13161e', borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '36px 32px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, color: '#8b90a7', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 16px' }}>FREE</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 52, fontWeight: 900, color: '#e8eaf0', letterSpacing: '-2px' }}>$0</span>
                <span style={{ color: '#8b90a7', fontSize: 14 }}>/month</span>
              </div>
              <p style={{ color: '#8b90a7', fontSize: 14, margin: '0 0 28px', fontFamily: 'Inter, sans-serif' }}>
                Everything you need to get started.
              </p>
              <div style={{ marginBottom: 32 }}>
                {[
                  'Up to 3 boards',
                  'Unlimited tasks',
                  'Real-time sync',
                  'Team invites (up to 3 members)',
                  'Due dates & priorities',
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ color: '#4caf50', fontSize: 14 }}>✓</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#d4d7e3' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" style={{
                display: 'block', textAlign: 'center',
                padding: '13px', borderRadius: 12, textDecoration: 'none',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#e8eaf0', fontSize: 15, fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
              }}>
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="pricing-card" style={{
              background: 'linear-gradient(145deg, #1a1540 0%, #13161e 60%)',
              borderRadius: 24,
              border: '1px solid rgba(108,99,255,0.4)',
              padding: '36px 32px',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(108,99,255,0.15)',
            }}>
              {/* Popular badge */}
              <div style={{
                position: 'absolute', top: 20, right: 20,
                padding: '4px 12px', borderRadius: 100,
                background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                fontSize: 11, fontWeight: 700, color: '#fff',
                fontFamily: 'Space Mono, monospace',
              }}>POPULAR</div>

              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, color: '#6c63ff', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 16px' }}>PRO</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 52, fontWeight: 900, color: '#e8eaf0', letterSpacing: '-2px' }}>$12</span>
                <span style={{ color: '#8b90a7', fontSize: 14 }}>/month per user</span>
              </div>
              <p style={{ color: '#8b90a7', fontSize: 14, margin: '0 0 28px', fontFamily: 'Inter, sans-serif' }}>
                For teams that need more power and scale.
              </p>
              <div style={{ marginBottom: 32 }}>
                {[
                  'Unlimited boards',
                  'Unlimited team members',
                  'Priority email support',
                  'Advanced analytics (coming soon)',
                  'Custom board templates (coming soon)',
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ color: '#6c63ff', fontSize: 14 }}>✓</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#d4d7e3' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                className="land-cta-btn"
                onClick={handleUpgrade}
                disabled={loadingCheckout}
                style={{
                  display: 'block', width: '100%', padding: '13px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                  border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
                  fontFamily: 'Inter, sans-serif', cursor: loadingCheckout ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 20px rgba(108,99,255,0.4)',
                  opacity: loadingCheckout ? 0.8 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {loadingCheckout
                  ? <><span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Processing...</>
                  : 'Upgrade to Pro →'
                }
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: 760, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(168,85,247,0.06))',
          border: '1px solid rgba(108,99,255,0.25)',
          borderRadius: 28, padding: '56px 40px',
          boxShadow: '0 0 60px rgba(108,99,255,0.08)',
        }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 14px', color: '#e8eaf0' }}>
            Ready to ship faster?
          </h2>
          <p style={{ color: '#8b90a7', fontSize: 16, margin: '0 0 32px', fontFamily: 'Inter, sans-serif' }}>
            Join teams who manage their work with AgileFlow. Free to start, live in 2 minutes.
          </p>
          <Link to="/register" className="land-cta-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 36px', borderRadius: 14, textDecoration: 'none',
            background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
            color: '#fff', fontSize: 16, fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 24px rgba(108,99,255,0.4)',
          }}>
            Get started free →
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
        maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Mono, monospace', fontWeight: 700, color: '#fff', fontSize: 11,
          }}>AF</div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#555a72', fontSize: 13 }}>
            © {new Date().getFullYear()} AgileFlow. All rights reserved.
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['#features', 'Features'], ['#pricing', 'Pricing'], ['/login', 'Login'], ['/register', 'Sign Up']].map(([href, label]) => (
            href.startsWith('/')
              ? <Link key={href} to={href} style={{ color: '#555a72', textDecoration: 'none', fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#8b90a7'} onMouseLeave={e => e.target.style.color='#555a72'}>{label}</Link>
              : <a key={href} href={href} style={{ color: '#555a72', textDecoration: 'none', fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#8b90a7'} onMouseLeave={e => e.target.style.color='#555a72'}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
