// File: client/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: 'rgba(13,15,20,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ background: 'var(--accent)', color: '#fff', fontFamily: 'Space Mono, monospace' }}
        >
          AF
        </div>
        <span className="font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          AgileFlow
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className="text-sm no-underline transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: 'var(--accent-glow)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-lg transition-all"
                style={{
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-3">
            <Link
              to="/login"
              className="text-sm px-4 py-1.5 rounded-lg no-underline transition-all"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm px-4 py-1.5 rounded-lg no-underline font-medium"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;