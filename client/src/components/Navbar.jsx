// File: client/src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px',
      background: 'rgba(13,15,20,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        .nav-link-item { transition: color 0.2s; }
        .nav-link-item:hover { color: #e8eaf0 !important; }
        .logout-btn { transition: all 0.2s; }
        .logout-btn:hover { background: rgba(255,92,92,0.12) !important; border-color: rgba(255,92,92,0.3) !important; color: #ff7070 !important; }
      `}</style>

      {/* Logo */}
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Space Mono, monospace', fontWeight: 700, color: '#fff', fontSize: 12,
          boxShadow: '0 4px 12px rgba(108,99,255,0.35)',
          flexShrink: 0,
        }}>AF</div>
        <span style={{ fontWeight: 800, fontSize: 16, color: '#e8eaf0', letterSpacing: '-0.3px' }}>
          AgileFlow
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Link
          to="/dashboard"
          className="nav-link-item"
          style={{
            padding: '7px 14px', borderRadius: 10, textDecoration: 'none', fontSize: 14,
            fontWeight: isActive('/dashboard') ? 600 : 500,
            color: isActive('/dashboard') ? '#e8eaf0' : '#8b90a7',
            background: isActive('/dashboard') ? 'rgba(255,255,255,0.07)' : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          Dashboard
        </Link>
      </div>

      {/* Right side — User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Avatar + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(108,99,255,0.25), rgba(168,85,247,0.2))',
            border: '1.5px solid rgba(108,99,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#a78bfa',
            flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: 11, color: '#555a72', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || ''}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)' }} />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="logout-btn"
          style={{
            padding: '7px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: '#8b90a7', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;