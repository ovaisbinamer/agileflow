// File: client/src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FloatingOrb = ({ style }) => (
  <div style={{
    position: 'absolute', borderRadius: '50%',
    filter: 'blur(60px)', opacity: 0.15,
    animation: 'pulse 4s ease-in-out infinite',
    ...style
  }} />
);

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);

  const calcStrength = (p) => {
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    setStrength(s);
  };

  const strengthConfig = [
    { label: '', color: 'transparent' },
    { label: 'Weak', color: '#ff5c5c' },
    { label: 'Fair', color: '#f5a623' },
    { label: 'Good', color: '#f5a623' },
    { label: 'Strong', color: '#4caf50' },
    { label: 'Very Strong', color: '#4caf50' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:0.15} 50%{transform:scale(1.1);opacity:0.25} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .reg-input {
          width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
          border-radius:12px; padding:14px 18px; font-size:14px; color:#e8eaf0; outline:none;
          transition:all 0.3s ease; font-family:'DM Sans',sans-serif; box-sizing:border-box;
        }
        .reg-input:focus { border-color:#6c63ff; background:rgba(108,99,255,0.08); box-shadow:0 0 0 4px rgba(108,99,255,0.15); }
        .reg-input::placeholder { color:rgba(139,144,167,0.6); }
        .submit-btn {
          width:100%; padding:14px; border-radius:12px; border:none; cursor:pointer;
          font-size:15px; font-weight:600; font-family:'DM Sans',sans-serif;
          background:linear-gradient(135deg,#6c63ff 0%,#a855f7 100%); color:#fff;
          transition:all 0.3s ease;
        }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 25px rgba(108,99,255,0.4); }
        .submit-btn:disabled { opacity:0.7; cursor:not-allowed; }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', position: 'relative',
        background: 'linear-gradient(135deg, #0d0f14 0%, #13111f 50%, #0d0f14 100%)',
        overflow: 'hidden', animation: 'slideInLeft 0.7s ease forwards',
      }}>
        <FloatingOrb style={{ width: 350, height: 350, background: '#a855f7', top: -80, left: -80 }} />
        <FloatingOrb style={{ width: 250, height: 250, background: '#6c63ff', bottom: 80, right: 0, animationDelay: '2s' }} />
        <FloatingOrb style={{ width: 180, height: 180, background: '#06b6d4', top: '40%', left: '40%', animationDelay: '1s' }} />

        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(108,99,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.05) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 60, animation: 'fadeInUp 0.6s ease 0.1s forwards', opacity: 0 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg,#6c63ff,#a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Space Mono,monospace',
              boxShadow: '0 8px 20px rgba(108,99,255,0.4)',
            }}>AF</div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#e8eaf0' }}>AgileFlow</span>
          </div>

          <h1 style={{
            fontSize: 40, fontWeight: 800, lineHeight: 1.2, marginBottom: 16,
            background: 'linear-gradient(135deg,#ffffff 0%,#a5b4fc 50%,#c084fc 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundSize: '200% auto',
            animation: 'shimmer 4s linear infinite, fadeInUp 0.6s ease 0.2s forwards', opacity: 0,
          }}>
            Your team's<br />command center<br />starts here.
          </h1>
          <p style={{ fontSize: 15, color: '#8b90a7', lineHeight: 1.7, marginBottom: 48, animation: 'fadeInUp 0.6s ease 0.3s forwards', opacity: 0 }}>
            Join thousands of teams shipping with confidence using AgileFlow's real-time Kanban boards.
          </p>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, animation: 'fadeInUp 0.6s ease 0.4s forwards', opacity: 0 }}>
            {[
              { step: '01', title: 'Create account', desc: 'Free forever, no credit card' },
              { step: '02', title: 'Create a board', desc: 'Set up your first project' },
              { step: '03', title: 'Invite your team', desc: 'Collaborate in real-time' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, paddingBottom: i < 2 ? 24 : 0, position: 'relative' }}>
                {i < 2 && <div style={{ position: 'absolute', left: 19, top: 40, bottom: 0, width: 1, background: 'linear-gradient(to bottom, rgba(108,99,255,0.5), transparent)' }} />}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#6c63ff', fontFamily: 'Space Mono,monospace',
                }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#e8eaf0', fontSize: 14, marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: '#8b90a7' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 50px', background: '#13161e',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        animation: 'slideInRight 0.7s ease forwards', position: 'relative', overflow: 'hidden',
      }}>
        <FloatingOrb style={{ width: 200, height: 200, background: '#a855f7', bottom: -60, right: -60, animationDelay: '1s', opacity: 0.08 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 36, animation: 'fadeInUp 0.5s ease 0.3s forwards', opacity: 0 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#e8eaf0', marginBottom: 8 }}>Create account</h2>
            <p style={{ fontSize: 14, color: '#8b90a7' }}>
              Already have one?{' '}
              <Link to="/login" style={{ color: '#6c63ff', textDecoration: 'none', fontWeight: 600 }}>Sign in →</Link>
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 10, marginBottom: 20,
              background: 'rgba(255,92,92,0.1)', border: '1px solid rgba(255,92,92,0.3)',
              color: '#ff7070', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', delay: '0.4s' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@company.com', delay: '0.5s' },
            ].map(f => (
              <div key={f.key} style={{ animation: `fadeInUp 0.5s ease ${f.delay} forwards`, opacity: 0 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  className="reg-input"
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  required
                />
              </div>
            ))}

            <div style={{ animation: 'fadeInUp 0.5s ease 0.6s forwards', opacity: 0 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                type="password"
                className="reg-input"
                placeholder="Min. 6 characters"
                value={form.password}
                minLength={6}
                onChange={e => { setForm(p => ({ ...p, password: e.target.value })); calcStrength(e.target.value); }}
                required
              />
              {form.password && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: i <= strength ? strengthConfig[strength]?.color : 'rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strengthConfig[strength]?.color }}>
                    {strengthConfig[strength]?.label}
                  </span>
                </div>
              )}
            </div>

            <div style={{ animation: 'fadeInUp 0.5s ease 0.7s forwards', opacity: 0, marginTop: 8 }}>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Creating account...
                  </span>
                ) : 'Create Account →'}
              </button>
            </div>
          </form>

          <p style={{ fontSize: 12, color: '#555a72', textAlign: 'center', marginTop: 28, lineHeight: 1.6, animation: 'fadeInUp 0.5s ease 0.8s forwards', opacity: 0 }}>
            By creating an account you agree to our{' '}
            <span style={{ color: '#6c63ff', cursor: 'pointer' }}>Terms</span> &{' '}
            <span style={{ color: '#6c63ff', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;