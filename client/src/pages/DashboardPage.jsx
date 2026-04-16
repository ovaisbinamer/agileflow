// File: client/src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const BOARD_COLORS = [
  { bg: 'linear-gradient(135deg, #6c63ff, #a855f7)', shadow: 'rgba(108,99,255,0.3)' },
  { bg: 'linear-gradient(135deg, #f5a623, #f97316)', shadow: 'rgba(245,166,35,0.3)' },
  { bg: 'linear-gradient(135deg, #4caf50, #22c55e)', shadow: 'rgba(76,175,80,0.3)' },
  { bg: 'linear-gradient(135deg, #e91e63, #ec4899)', shadow: 'rgba(233,30,99,0.3)' },
  { bg: 'linear-gradient(135deg, #00bcd4, #06b6d4)', shadow: 'rgba(0,188,212,0.3)' },
  { bg: 'linear-gradient(135deg, #ff5722, #ef4444)', shadow: 'rgba(255,87,34,0.3)' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const { data } = await api.get('/boards');
        setBoards(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newBoard.name.trim()) return;
    try {
      setCreating(true);
      const { data } = await api.post('/boards', newBoard);
      setBoards((prev) => [...prev, data]);
      setNewBoard({ name: '', description: '' });
      setShowCreate(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (boardId) => {
    if (!window.confirm('Delete this board and all its tasks?')) return;
    try {
      await api.delete(`/boards/${boardId}`);
      setBoards((prev) => prev.filter((b) => b._id !== boardId));
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AF';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0f14',
      paddingTop: 80,
    }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .board-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .board-card:hover { transform: translateY(-4px); }
        .delete-btn { opacity: 0; transition: opacity 0.2s; }
        .board-card:hover .delete-btn { opacity: 1; }
        .create-input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 12px 16px;
          color: #e8eaf0; font-size: 14px; outline: none;
          font-family: 'DM Sans', sans-serif; width: 100%; box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .create-input:focus { border-color: #6c63ff; }
        .create-input::placeholder { color: rgba(139,144,167,0.5); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

        {/* Header Row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 48, animation: 'fadeInUp 0.5s ease forwards',
        }}>
          <div>
            <div style={{
              fontSize: 12, fontWeight: 600, color: '#6c63ff', letterSpacing: '0.12em',
              textTransform: 'uppercase', fontFamily: 'Space Mono, monospace', marginBottom: 8,
            }}>
              YOUR WORKSPACE
            </div>
            <h1 style={{
              fontSize: 36, fontWeight: 800, color: '#e8eaf0',
              letterSpacing: '-0.5px', margin: 0, lineHeight: 1.2,
            }}>
              Hey, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: '#8b90a7', fontSize: 15, marginTop: 6 }}>
              {boards.length === 0
                ? 'Create your first board to get started'
                : `${boards.length} board${boards.length !== 1 ? 's' : ''} in your workspace`}
            </p>
          </div>

          <button
            onClick={() => setShowCreate(!showCreate)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: showCreate ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #6c63ff, #a855f7)',
              color: '#fff', fontSize: 14, fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s',
              boxShadow: showCreate ? 'none' : '0 4px 20px rgba(108,99,255,0.4)',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{showCreate ? '×' : '+'}</span>
            {showCreate ? 'Cancel' : 'New Board'}
          </button>
        </div>

        {/* Create Board Form */}
        {showCreate && (
          <div style={{
            background: 'rgba(108,99,255,0.06)',
            border: '1px solid rgba(108,99,255,0.25)',
            borderRadius: 20, padding: 28, marginBottom: 40,
            animation: 'fadeInUp 0.3s ease forwards',
            boxShadow: '0 0 40px rgba(108,99,255,0.1)',
          }}>
            <h3 style={{ color: '#e8eaf0', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
              Create New Board
            </h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                    Board Name *
                  </label>
                  <input
                    autoFocus
                    type="text"
                    className="create-input"
                    placeholder="e.g. Sprint 1, Marketing Q2..."
                    value={newBoard.name}
                    onChange={(e) => setNewBoard(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                    Description
                  </label>
                  <input
                    type="text"
                    className="create-input"
                    placeholder="Optional description..."
                    value={newBoard.description}
                    onChange={(e) => setNewBoard(p => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating || !newBoard.name.trim()}
                  style={{
                    padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                    color: '#fff', fontSize: 14, fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap',
                    opacity: creating || !newBoard.name.trim() ? 0.6 : 1,
                    height: 46,
                  }}
                >
                  {creating ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                      Creating...
                    </span>
                  ) : 'Create Board'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#6c63ff', animation: 'spin 1s ease infinite',
                  animationDelay: `${i * 0.15}s`,
                }} />
              ))}
            </div>
          </div>

        /* Empty State */
        ) : boards.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 0',
            animation: 'fadeInUp 0.5s ease forwards',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, marginBottom: 20,
            }}>🗂</div>
            <h3 style={{ color: '#e8eaf0', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No boards yet</h3>
            <p style={{ color: '#8b90a7', fontSize: 14, marginBottom: 24 }}>Create your first board to start organizing tasks</p>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
              }}
            >
              + Create First Board
            </button>
          </div>

        /* Board Grid */
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}>
            {boards.map((board, i) => {
              const color = BOARD_COLORS[i % BOARD_COLORS.length];
              const date = new Date(board.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              return (
                <div
                  key={board._id}
                  className="board-card"
                  style={{
                    background: '#13161e',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 20, overflow: 'hidden',
                    animation: `fadeInUp 0.4s ease ${i * 0.06}s forwards`,
                    opacity: 0,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                    position: 'relative',
                  }}
                >
                  {/* Color bar top */}
                  <div style={{ height: 4, background: color.bg }} />

                  <div style={{ padding: 24 }}>
                    {/* Icon + Delete */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: color.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: '#fff',
                        fontFamily: 'Space Mono, monospace',
                        boxShadow: `0 4px 12px ${color.shadow}`,
                      }}>
                        {getInitials(board.name)}
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(board._id)}
                        style={{
                          background: 'rgba(255,92,92,0.1)', border: '1px solid rgba(255,92,92,0.2)',
                          borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
                          color: '#ff7070', fontSize: 12,
                        }}
                        title="Delete board"
                      >
                        🗑 Delete
                      </button>
                    </div>

                    {/* Board name & description */}
                    <h3 style={{
                      color: '#e8eaf0', fontSize: 17, fontWeight: 700,
                      marginBottom: 6, letterSpacing: '-0.2px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {board.name}
                    </h3>
                    <p style={{
                      color: '#8b90a7', fontSize: 13, marginBottom: 20,
                      lineHeight: 1.5, minHeight: 20,
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {board.description || 'No description provided'}
                    </p>

                    {/* Footer */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 16,
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: '#4caf50', boxShadow: '0 0 6px #4caf50',
                        }} />
                        <span style={{ fontSize: 11, color: '#8b90a7', fontFamily: 'Space Mono, monospace' }}>
                          {board.members?.length || 1} member{board.members?.length !== 1 ? 's' : ''}
                        </span>
                        <span style={{ fontSize: 11, color: '#555a72', marginLeft: 8 }}>{date}</span>
                      </div>
                      <Link
                        to={`/board/${board._id}`}
                        style={{
                          padding: '8px 16px', borderRadius: 10, textDecoration: 'none',
                          background: color.bg, color: '#fff',
                          fontSize: 12, fontWeight: 600,
                          boxShadow: `0 2px 8px ${color.shadow}`,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.85'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        Open →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;