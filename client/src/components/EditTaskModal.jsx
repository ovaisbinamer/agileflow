// File: client/src/components/EditTaskModal.jsx
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#ff5c5c' },
  medium: { label: 'Medium', color: '#f5a623' },
  low:    { label: 'Low',    color: '#4caf50' },
};

const EditTaskModal = ({ task, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: task.title || '',
    content: task.content || '',
    priority: task.priority || 'medium',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) { setError('Description is required'); return; }
    setSaving(true);
    setError('');
    try {
      const { data: updated } = await api.put(`/tasks/${task._id}`, {
        title: form.title,
        content: form.content,
        priority: form.priority,
        dueDate: form.dueDate || null,
      });
      onSave(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
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
        animation: 'fadeIn 0.15s ease forwards',
      }}
    >
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .edit-input {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 11px 14px;
          font-size: 14px; color: #e8eaf0; outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, background 0.2s;
        }
        .edit-input:focus { border-color: #6c63ff; background: rgba(108,99,255,0.06); }
        .edit-input::placeholder { color: rgba(139,144,167,0.4); }
        .priority-btn { border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 7px 14px; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
      `}</style>

      <div style={{
        background: '#13161e',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, padding: '28px',
        width: '100%', maxWidth: 520,
        animation: 'slideUp 0.2s ease forwards',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#e8eaf0', letterSpacing: '-0.3px' }}>
            Edit Task
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)', border: 'none',
              borderRadius: 8, width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#8b90a7', fontSize: 18,
            }}
          >×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Title (optional)
            </label>
            <input
              type="text"
              className="edit-input"
              placeholder="Short title..."
              value={form.title}
              onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
            />
          </div>

          {/* Content */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Description *
            </label>
            <textarea
              autoFocus
              rows={4}
              className="edit-input"
              style={{ resize: 'vertical' }}
              placeholder="What needs to be done?"
              value={form.content}
              onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {/* Priority */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Priority
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, priority: key }))}
                    className="priority-btn"
                    style={{
                      background: form.priority === key ? `${cfg.color}20` : 'rgba(255,255,255,0.04)',
                      borderColor: form.priority === key ? `${cfg.color}60` : 'rgba(255,255,255,0.1)',
                      color: form.priority === key ? cfg.color : '#8b90a7',
                      flex: 1,
                    }}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8b90a7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Due Date
              </label>
              <input
                type="date"
                className="edit-input"
                value={form.dueDate}
                onChange={(e) => setForm(p => ({ ...p, dueDate: e.target.value }))}
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,92,92,0.1)', border: '1px solid rgba(255,92,92,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#ff7070', fontSize: 13 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px', borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#8b90a7', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.content.trim()}
              style={{
                padding: '10px 24px', borderRadius: 10,
                background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                border: 'none',
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                opacity: saving || !form.content.trim() ? 0.6 : 1,
                boxShadow: '0 4px 16px rgba(108,99,255,0.3)',
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
