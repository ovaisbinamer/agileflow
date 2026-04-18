// File: client/src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const BOARD_COLORS = [
  { bg: 'linear-gradient(135deg, #6c63ff, #a855f7)', shadow: 'rgba(108,99,255,0.3)', accent: '#6c63ff' },
  { bg: 'linear-gradient(135deg, #f5a623, #f97316)', shadow: 'rgba(245,166,35,0.3)', accent: '#f5a623' },
  { bg: 'linear-gradient(135deg, #4caf50, #22c55e)', shadow: 'rgba(76,175,80,0.3)', accent: '#4caf50' },
  { bg: 'linear-gradient(135deg, #e91e63, #ec4899)', shadow: 'rgba(233,30,99,0.3)', accent: '#e91e63' },
  { bg: 'linear-gradient(135deg, #00bcd4, #06b6d4)', shadow: 'rgba(0,188,212,0.3)', accent: '#00bcd4' },
  { bg: 'linear-gradient(135deg, #ff5722, #ef4444)', shadow: 'rgba(255,87,34,0.3)', accent: '#ff5722' },
];

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{
    background: '#13161e',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 18, padding: '20px 24px',
    display: 'flex', alignItems: 'center', gap: 16,
    flex: 1, minWidth: 0,
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
      background: `${color}18`, border: `1px solid ${color}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
    }}>{icon}</div>
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontSize: 28, fontWeight: 800, color: '#e8eaf0',
        letterSpacing: '-0.5px', lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 12, color: '#8b90a7', marginTop: 4, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color, marginTop: 3, fontWeight: 600 }}>{sub}</div>}
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ totalTasks: 0, doneTasks: 0, overdueTasks: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: boardsData } = await api.get('/boards');
        setBoards(boardsData);

        // Fetch tasks for all boards to compute stats
        const taskResults = await Promise.all(
          boardsData.map(b => api.get(`/tasks?boardId=${b._id}`).then(r => r.data).catch(() => []))
        );
        const allTasks = taskResults.flat();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const overdue = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.columnId !== 'done');
        const done = allTasks.filter(t => t.columnId === 'done');
        setStats({ totalTasks: allTasks.length, doneTasks: done.length, overdueTasks: overdue.length });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newBoard.name.trim()) return;
    try {
      setCreating(true);
      const { data } = await api.post('/boards', newBoard);
      setBoards(prev => [...prev, data]);
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
      setBoards(prev => prev.filter(b => b._id !== boardId));
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AF';

  const filteredBoards = boards.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f14', paddingTop: 64 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .board-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .board-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(0,0,0,0.35) !important; }
        .delete-btn { opacity: 0; transition: opacity 0.2s; }
        .board-card:hover .delete-btn { opacity: 1; }
        .create-input {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 12px 16px; color: #e8eaf0;
          font-size: 14px; outline: none; font-family: 'Inter', sans-serif;
          width: 100%; box-sizing: border-box; transition: border-color 0.2s;
        }
        .create-input:focus { border-color: #6c63ff; }
        .create-input::placeholder { color: rgba(139,144,167,0.5); }
        .search-input {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 10px 16px 10px 40px;
          color: #e8eaf0; font-size: 14px; outline: none;
          font-family: 'Inter', sans-serif; width: 260px; transition: all 0.2s;
          box-sizing: border-box;
        }
        .search-input:focus { border-color: #6c63ff; background: rgba(108,99,255,0.06); width: 300px; }
        .search-input::placeholder { color: rgba(139,144,167,0.45); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px', fontFamily: 'Inter, sans-serif' }}>

        {/* ===== Header ===== */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: 36, animation: 'fadeInUp 0.5s ease forwards', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#6c63ff', letterSpacing: '0.12em',
              textTransform: 'uppercase', fontFamily: 'Space Mono, monospace', marginBottom: 8,
            }}>
              YOUR WORKSPACE
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: '#e8eaf0', letterSpacing: '-0.5px', margin: 0, lineHeight: 1.2 }}>
              {getGreeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: '#8b90a7', fontSize: 14, marginTop: 6, margin: '6px 0 0' }}>
              {loading ? 'Loading your workspace...' : boards.length === 0
                ? 'Create your first board to get started'
                : `${boards.length} board${boards.length !== 1 ? 's' : ''} in your workspace`}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: '#555a72', pointerEvents: 'none',
              }}>🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* New Board button */}
            <button
              onClick={() => setShowCreate(!showCreate)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 22px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: showCreate ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #6c63ff, #a855f7)',
                color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
                boxShadow: showCreate ? 'none' : '0 4px 20px rgba(108,99,255,0.4)',
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{showCreate ? '×' : '+'}</span>
              {showCreate ? 'Cancel' : 'New Board'}
            </button>
          </div>
        </div>

        {/* ===== Stats Bar ===== */}
        {!loading && (
          <div style={{
            display: 'flex', gap: 16, marginBottom: 36,
            animation: 'fadeInUp 0.5s ease 0.1s forwards', opacity: 0,
            flexWrap: 'wrap',
          }}>
            <StatCard
              icon="🗂️"
              label="Total Boards"
              value={boards.length}
              color="#6c63ff"
              sub={boards.length > 0 ? 'Active workspaces' : 'Create one to start'}
            />
            <StatCard
              icon="✅"
              label="Tasks Completed"
              value={stats.doneTasks}
              color="#4caf50"
              sub={stats.totalTasks > 0 ? `${Math.round((stats.doneTasks / stats.totalTasks) * 100)}% of ${stats.totalTasks} total` : 'No tasks yet'}
            />
            <StatCard
              icon="⚠️"
              label="Overdue Tasks"
              value={stats.overdueTasks}
              color={stats.overdueTasks > 0 ? '#ff5c5c' : '#4caf50'}
              sub={stats.overdueTasks > 0 ? 'Need attention' : 'All on track!'}
            />
          </div>
        )}

        {/* ===== Create Board Form ===== */}
        {showCreate && (
          <div style={{
            background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.25)',
            borderRadius: 20, padding: 28, marginBottom: 36,
            animation: 'fadeInUp 0.3s ease forwards',
            boxShadow: '0 0 40px rgba(108,99,255,0.08)',
          }}>
            <h3 style={{ color: '#e8eaf0', fontSize: 16, fontWeight: 700, margin: '0 0 20px', fontFamily: 'Inter, sans-serif' }}>
              Create New Board
            </h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                    Board Name *
                  </label>
                  <input
                    autoFocus type="text" className="create-input"
                    placeholder="e.g. Sprint 1, Marketing Q2..."
                    value={newBoard.name}
                    onChange={e => setNewBoard(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                    Description
                  </label>
                  <input
                    type="text" className="create-input"
                    placeholder="Optional description..."
                    value={newBoard.description}
                    onChange={e => setNewBoard(p => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating || !newBoard.name.trim()}
                  style={{
                    padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                    color: '#fff', fontSize: 14, fontWeight: 600,
                    fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
                    opacity: creating || !newBoard.name.trim() ? 0.6 : 1, height: 46,
                  }}
                >
                  {creating
                    ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                        Creating...
                      </span>
                    : 'Create Board'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===== Loading ===== */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#6c63ff', animation: `pulse 1s ease ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>

        /* ===== Empty State ===== */
        ) : filteredBoards.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 0',
            animation: 'fadeInUp 0.5s ease forwards',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 20,
            }}>{searchQuery ? '🔍' : '🗂️'}</div>
            <h3 style={{ color: '#e8eaf0', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
              {searchQuery ? `No boards matching "${searchQuery}"` : 'No boards yet'}
            </h3>
            <p style={{ color: '#8b90a7', fontSize: 14, marginBottom: 24, margin: '0 0 24px' }}>
              {searchQuery ? 'Try a different search term' : 'Create your first board to start organizing tasks'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreate(true)}
                style={{
                  padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                  color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                }}
              >
                + Create First Board
              </button>
            )}
          </div>

        /* ===== Board Grid ===== */
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filteredBoards.map((board, i) => {
              const color = BOARD_COLORS[i % BOARD_COLORS.length];
              const date = new Date(board.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const memberCount = board.members?.length || 1;
              return (
                <div
                  key={board._id}
                  className="board-card"
                  style={{
                    background: '#13161e', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 20, overflow: 'hidden',
                    animation: `fadeInUp 0.4s ease ${i * 0.06}s forwards`, opacity: 0,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative',
                  }}
                >
                  {/* Color bar */}
                  <div style={{ height: 4, background: color.bg }} />

                  <div style={{ padding: '22px 24px 20px' }}>
                    {/* Icon row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 13,
                        background: color.bg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 13, fontWeight: 700,
                        color: '#fff', fontFamily: 'Space Mono, monospace',
                        boxShadow: `0 4px 12px ${color.shadow}`,
                      }}>
                        {getInitials(board.name)}
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(board._id)}
                        style={{
                          background: 'rgba(255,92,92,0.1)', border: '1px solid rgba(255,92,92,0.2)',
                          borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
                          color: '#ff7070', fontSize: 12, fontFamily: 'Inter, sans-serif',
                        }}
                        title="Delete board"
                      >
                        🗑 Delete
                      </button>
                    </div>

                    {/* Board name */}
                    <h3 style={{
                      color: '#e8eaf0', fontSize: 17, fontWeight: 700, margin: '0 0 6px',
                      letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {board.name}
                    </h3>
                    <p style={{
                      color: '#8b90a7', fontSize: 13, margin: '0 0 20px', lineHeight: 1.5, minHeight: 20,
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {board.description || 'No description provided'}
                    </p>

                    {/* Footer */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Members pill */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '4px 10px', borderRadius: 100,
                          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf50', boxShadow: '0 0 5px #4caf50' }} />
                          <span style={{ fontSize: 11, color: '#8b90a7', fontFamily: 'Space Mono, monospace' }}>
                            {memberCount} {memberCount === 1 ? 'member' : 'members'}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: '#3a3e52' }}>{date}</span>
                      </div>

                      <Link
                        to={`/board/${board._id}`}
                        style={{
                          padding: '8px 18px', borderRadius: 10, textDecoration: 'none',
                          background: color.bg, color: '#fff', fontSize: 12, fontWeight: 700,
                          boxShadow: `0 2px 10px ${color.shadow}`, transition: 'opacity 0.2s',
                          fontFamily: 'Inter, sans-serif',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
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