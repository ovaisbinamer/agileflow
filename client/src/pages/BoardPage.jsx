// File: client/src/pages/BoardPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';
import InviteMembersModal from '../components/InviteMembersModal';
import api from '../api/axios';

const BoardPage = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const { data } = await api.get(`/boards/${boardId}`);
        setBoard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [boardId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d0f14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%', background: '#6c63ff',
              animation: 'bounce 0.8s ease infinite', animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
      </div>
    );
  }

  if (!board) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d0f14', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: '#8b90a7', fontSize: 16 }}>Board not found.</p>
        <Link to="/dashboard" style={{ color: '#6c63ff', textDecoration: 'none', fontSize: 14 }}>← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f14', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeInDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .invite-btn { transition: all 0.2s; }
        .invite-btn:hover { background: rgba(108,99,255,0.15) !important; border-color: rgba(108,99,255,0.4) !important; color: #a89fff !important; }
      `}</style>

      {/* Board Header */}
      <div style={{
        paddingTop: 72, paddingBottom: 0,
        background: 'linear-gradient(180deg, #13161e 0%, #0d0f14 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        animation: 'fadeInDown 0.4s ease forwards',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 32px 0' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Link to="/dashboard" style={{ color: '#8b90a7', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#e8eaf0'}
              onMouseLeave={e => e.target.style.color = '#8b90a7'}
            >
              ← Dashboard
            </Link>
            <span style={{ color: '#2a2f45', fontSize: 13 }}>/</span>
            <span style={{ color: '#6c63ff', fontSize: 13, fontWeight: 600 }}>{board.name}</span>
          </div>

          {/* Board Title Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#e8eaf0', margin: 0, letterSpacing: '-0.5px' }}>
                {board.name}
              </h1>
              {board.description && (
                <p style={{ color: '#8b90a7', fontSize: 13, marginTop: 4 }}>{board.description}</p>
              )}
            </div>

            {/* Right side badges + invite */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Live badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 20,
                background: 'rgba(76,175,80,0.1)',
                border: '1px solid rgba(76,175,80,0.25)',
              }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#4caf50', boxShadow: '0 0 6px #4caf50',
                  animation: 'pulse 2s ease infinite',
                }} />
                <span style={{ fontSize: 12, color: '#4caf50', fontWeight: 600, fontFamily: 'Space Mono, monospace' }}>LIVE</span>
              </div>

              {/* Member count */}
              <div style={{
                padding: '6px 14px', borderRadius: 20,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: 12, color: '#8b90a7',
                fontFamily: 'Space Mono, monospace',
              }}>
                {board.members?.length || 1} member{board.members?.length !== 1 ? 's' : ''}
              </div>

              {/* Invite button */}
              <button
                className="invite-btn"
                onClick={() => setShowInvite(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 16px', borderRadius: 20,
                  background: 'rgba(108,99,255,0.08)',
                  border: '1px solid rgba(108,99,255,0.25)',
                  color: '#6c63ff', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}
              >
                <span style={{ fontSize: 14 }}>👥</span>
                Invite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <KanbanBoard boardId={boardId} />
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <InviteMembersModal board={board} onClose={() => setShowInvite(false)} />
      )}
    </div>
  );
};

export default BoardPage;