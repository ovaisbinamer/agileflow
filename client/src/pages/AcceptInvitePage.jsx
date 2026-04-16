// File: client/src/pages/AcceptInvitePage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AcceptInvitePage = () => {
  const { token } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');
  const [boardId, setBoardId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Store token in sessionStorage so we can re-try after login
      sessionStorage.setItem('pendingInviteToken', token);
      navigate(`/login?redirect=/invite/${token}`);
      return;
    }

    const accept = async () => {
      try {
        const { data } = await api.get(`/invites/accept/${token}`);
        setBoardId(data.boardId);
        setState('success');
        setMessage(data.message || "You've joined the board!");
      } catch (err) {
        setState('error');
        setMessage(err.response?.data?.message || 'Invalid or expired invite link.');
      }
    };
    accept();
  }, [token, isAuthenticated, navigate]);

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0f14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <div style={{
        background: '#13161e', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, padding: 48,
        maxWidth: 440, width: '100%', textAlign: 'center',
        animation: 'fadeInUp 0.4s ease forwards',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
      }}>
        {state === 'loading' && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              border: '3px solid rgba(108,99,255,0.2)',
              borderTopColor: '#6c63ff',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 24px',
            }} />
            <h2 style={{ color: '#e8eaf0', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
              Accepting Invite...
            </h2>
            <p style={{ color: '#8b90a7', fontSize: 14, margin: 0 }}>
              Just a moment while we add you to the board.
            </p>
          </>
        )}

        {state === 'success' && (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 24px',
            }}>🎉</div>
            <h2 style={{ color: '#e8eaf0', fontSize: 22, fontWeight: 800, margin: '0 0 10px' }}>
              You're in!
            </h2>
            <p style={{ color: '#8b90a7', fontSize: 15, margin: '0 0 28px', lineHeight: 1.5 }}>
              {message}
            </p>
            {boardId && (
              <Link
                to={`/board/${boardId}`}
                style={{
                  display: 'inline-block', padding: '12px 28px',
                  borderRadius: 12, textDecoration: 'none',
                  background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                  color: '#fff', fontSize: 15, fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(108,99,255,0.4)',
                }}
              >
                Open Board →
              </Link>
            )}
          </>
        )}

        {state === 'error' && (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'rgba(255,92,92,0.1)', border: '1px solid rgba(255,92,92,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 24px',
            }}>⚠️</div>
            <h2 style={{ color: '#e8eaf0', fontSize: 22, fontWeight: 800, margin: '0 0 10px' }}>
              Invite Error
            </h2>
            <p style={{ color: '#8b90a7', fontSize: 15, margin: '0 0 28px', lineHeight: 1.5 }}>
              {message}
            </p>
            <Link
              to="/dashboard"
              style={{
                display: 'inline-block', padding: '12px 28px',
                borderRadius: 12, textDecoration: 'none',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#e8eaf0', fontSize: 15, fontWeight: 600,
              }}
            >
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitePage;
