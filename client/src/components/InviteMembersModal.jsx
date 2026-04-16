// File: client/src/components/InviteMembersModal.jsx
import { useState, useRef } from 'react';
import api from '../api/axios';

const InviteMembersModal = ({ board, onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success'|'error', text: string }
  const [sending, setSending] = useState(false);
  const overlayRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setStatus(null);
    try {
      await api.post('/invites', { email: email.trim(), boardId: board._id });
      setStatus({ type: 'success', text: `Invite sent to ${email}!` });
      setEmail('');
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Failed to send invite' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .invite-input {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 11px 14px;
          font-size: 14px; color: #e8eaf0; outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s;
        }
        .invite-input:focus { border-color: #6c63ff; background: rgba(108,99,255,0.06); }
        .invite-input::placeholder { color: rgba(139,144,167,0.4); }
      `}</style>

      <div style={{
        background: '#13161e',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, padding: 28,
        width: '100%', maxWidth: 460,
        animation: 'slideUp 0.2s ease forwards',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#e8eaf0' }}>Invite to Board</h2>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#8b90a7', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >×</button>
        </div>
        <p style={{ margin: '0 0 24px', fontSize: 13, color: '#8b90a7' }}>
          Send an invite link to collaborate on <strong style={{ color: '#6c63ff' }}>{board.name}</strong>
        </p>

        <form onSubmit={handleSend}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Email Address
          </label>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input
              autoFocus
              type="email"
              className="invite-input"
              placeholder="teammate@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={sending || !email.trim()}
              style={{
                padding: '11px 20px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: sending ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap',
                opacity: sending || !email.trim() ? 0.6 : 1,
                boxShadow: '0 4px 16px rgba(108,99,255,0.3)',
              }}
            >
              {sending ? 'Sending...' : 'Send Invite'}
            </button>
          </div>

          {status && (
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: status.type === 'success' ? 'rgba(76,175,80,0.1)' : 'rgba(255,92,92,0.1)',
              border: `1px solid ${status.type === 'success' ? 'rgba(76,175,80,0.3)' : 'rgba(255,92,92,0.3)'}`,
              color: status.type === 'success' ? '#4caf50' : '#ff7070',
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {status.type === 'success' ? '✓' : '!'} {status.text}
            </div>
          )}
        </form>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ margin: 0, fontSize: 12, color: '#555a72', lineHeight: 1.5 }}>
            📧 An invite link will be emailed to them. The link expires in <strong style={{ color: '#8b90a7' }}>7 days</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteMembersModal;
