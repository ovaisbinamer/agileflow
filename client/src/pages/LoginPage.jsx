// File: client/src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FloatingOrb = ({ style }) => (
  <div style={{
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(60px)',
    opacity: 0.15,
    animation: 'pulse 4s ease-in-out infinite',
    ...style
  }} />
);

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-primary)',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.25; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 14px;
          color: #e8eaf0;
          outline: none;
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }
        .login-input:focus {
          border-color: #6c63ff;
          background: rgba(108,99,255,0.08);
          box-shadow: 0 0 0 4px rgba(108,99,255,0.15);
        }
        .login-input::placeholder { color: rgba(139,144,167,0.6); }
        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(135deg, #6c63ff 0%, #a855f7 100%);
          color: #fff;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(108,99,255,0.4);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
          animation: slideInLeft 0.6s ease forwards;
          opacity: 0;
        }
        .stat-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 20px;
          animation: float 3s ease-in-out infinite;
          backdrop-filter: blur(10px);
        }
      `}</style>

      {/* LEFT PANEL — Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        background: 'linear-gradient(135deg, #0d0f14 0%, #13111f 50%, #0d0f14 100%)',
        overflow: 'hidden',
        animation: 'slideInLeft 0.7s ease forwards',
      }}>
        {/* Background orbs */}
        <FloatingOrb style={{ width: 400, height: 400, background: '#6c63ff', top: -100, left: -100, animationDelay: '0s' }} />
        <FloatingOrb style={{ width: 300, height: 300, background: '#a855f7', bottom: 100, right: -50, animationDelay: '2s' }} />
        <FloatingOrb style={{ width: 200, height: 200, background: '#06b6d4', top: '50%', left: '30%', animationDelay: '1s' }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 60, animation: 'fadeInUp 0.6s ease 0.1s forwards', opacity: 0 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Space Mono, monospace',
              boxShadow: '0 8px 20px rgba(108,99,255,0.4)',
            }}>AF</div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#e8eaf0', letterSpacing: '-0.5px' }}>AgileFlow</span>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 48 }}>
            <h1 style={{
              fontSize: 44, fontWeight: 800, lineHeight: 1.15, marginBottom: 16,
              background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
              animation: 'shimmer 4s linear infinite, fadeInUp 0.6s ease 0.2s forwards',
              opacity: 0,
            }}>
              Ship faster.<br />Stay in sync.<br />Win together.
            </h1>
            <p style={{ fontSize: 16, color: '#8b90a7', lineHeight: 1.7, animation: 'fadeInUp 0.6s ease 0.3s forwards', opacity: 0 }}>
              The real-time Agile board your team actually wants to use.
            </p>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
            {[
              { icon: '⚡', color: '#6c63ff', bg: 'rgba(108,99,255,0.15)', text: 'Real-time sync across all teammates', delay: '0.4s' },
              { icon: '🎯', color: '#a855f7', bg: 'rgba(168,85,247,0.15)', text: 'Drag & drop Kanban with priorities', delay: '0.5s' },
              { icon: '🔒', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', text: 'Secure JWT authentication', delay: '0.6s' },
            ].map((f, i) => (
              <div key={i} className="feature-item" style={{ animationDelay: f.delay }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: f.bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18, flexShrink: 0,
                  border: `1px solid ${f.color}30`,
                }}>
                  <span style={{ fontSize: 16 }}>{f.icon}</span>
                </div>
                <span style={{ fontSize: 14, color: '#c4c7d6' }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, animation: 'fadeInUp 0.6s ease 0.7s forwards', opacity: 0 }}>
            {[
              { value: '3x', label: 'Faster delivery' },
              { value: '100%', label: 'Real-time updates' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.5}s` }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#6c63ff', fontFamily: 'Space Mono, monospace', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#8b90a7' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div style={{
        width: 480,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 50px',
        background: '#13161e',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        animation: 'slideInRight 0.7s ease forwards',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <FloatingOrb style={{ width: 250, height: 250, background: '#6c63ff', top: -80, right: -80, animationDelay: '1s', opacity: 0.08 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: 40, animation: 'fadeInUp 0.5s ease 0.3s forwards', opacity: 0 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#e8eaf0', marginBottom: 8, letterSpacing: '-0.5px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 14, color: '#8b90a7' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#6c63ff', textDecoration: 'none', fontWeight: 600 }}>
                Sign up free →
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 10, marginBottom: 20,
              background: 'rgba(255,92,92,0.1)', border: '1px solid rgba(255,92,92,0.3)',
              color: '#ff7070', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
              animation: 'fadeInUp 0.3s ease forwards',
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ animation: 'fadeInUp 0.5s ease 0.4s forwards', opacity: 0 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                Email Address
              </label>
              <input
                type="email"
                className="login-input"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>

            <div style={{ animation: 'fadeInUp 0.5s ease 0.5s forwards', opacity: 0 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                type="password"
                className="login-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>

            <div style={{ animation: 'fadeInUp 0.5s ease 0.6s forwards', opacity: 0, marginTop: 8 }}>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Signing in...
                  </span>
                ) : 'Sign In →'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0', animation: 'fadeInUp 0.5s ease 0.7s forwards', opacity: 0 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 12, color: '#555a72' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Social buttons (decorative) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, animation: 'fadeInUp 0.5s ease 0.8s forwards', opacity: 0 }}>
            {[
              { name: 'Google', icon: 'G' },
              { name: 'GitHub', icon: '⌥' },
            ].map((s) => (
              <button key={s.name} onClick={() => alert('OAuth coming soon!')} style={{
                padding: '11px', borderRadius: 10, cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#8b90a7', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = '#e8eaf0'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.color = '#8b90a7'; }}
              >
                <span style={{ fontWeight: 700 }}>{s.icon}</span> {s.name}
              </button>
            ))}
          </div>

          {/* Footer */}
          <p style={{ fontSize: 12, color: '#555a72', textAlign: 'center', marginTop: 32, lineHeight: 1.6, animation: 'fadeInUp 0.5s ease 0.9s forwards', opacity: 0 }}>
            By signing in you agree to our{' '}
            <span style={{ color: '#6c63ff', cursor: 'pointer' }}>Terms</span> &{' '}
            <span style={{ color: '#6c63ff', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;