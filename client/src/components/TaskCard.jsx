// File: client/src/components/TaskCard.jsx
import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import EditTaskModal from './EditTaskModal';
import api from '../api/axios';

const PRIORITY_CONFIG = {
  high:   { label: 'HIGH',   color: '#ff5c5c', bg: 'rgba(255,92,92,0.12)',  border: 'rgba(255,92,92,0.25)'  },
  medium: { label: 'MED',    color: '#f5a623', bg: 'rgba(245,166,35,0.12)', border: 'rgba(245,166,35,0.25)' },
  low:    { label: 'LOW',    color: '#4caf50', bg: 'rgba(76,175,80,0.12)',  border: 'rgba(76,175,80,0.25)'  },
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const getDueDateState = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `${formatDate(dueDate)}`, state: 'overdue' };
  if (diff === 0) return { label: 'Due today', state: 'today' };
  if (diff <= 2) return { label: formatDate(dueDate), state: 'soon' };
  return { label: formatDate(dueDate), state: 'normal' };
};

const DUE_COLORS = {
  overdue: { color: '#ff5c5c', bg: 'rgba(255,92,92,0.12)', border: 'rgba(255,92,92,0.25)', icon: '⚠' },
  today:   { color: '#f5a623', bg: 'rgba(245,166,35,0.12)', border: 'rgba(245,166,35,0.25)', icon: '⏰' },
  soon:    { color: '#f5a623', bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.2)', icon: '📅' },
  normal:  { color: '#8b90a7', bg: 'rgba(139,144,167,0.08)', border: 'rgba(139,144,167,0.15)', icon: '📅' },
};

const TaskCard = ({ task, index, onDelete, onUpdate }) => {
  const [showEdit, setShowEdit] = useState(false);
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const dueDateState = getDueDateState(task.dueDate);
  const dueStyle = dueDateState ? DUE_COLORS[dueDateState.state] : null;
  const isOverdue = dueDateState?.state === 'overdue';

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await api.delete(`/tasks/${task._id}`);
      onDelete(task._id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEdit(true);
  };

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              marginBottom: 10,
              background: snapshot.isDragging ? '#21253a' : '#1a1d27',
              border: `1px solid ${
                isOverdue && !snapshot.isDragging
                  ? 'rgba(255,92,92,0.2)'
                  : snapshot.isDragging
                  ? '#6c63ff'
                  : 'rgba(255,255,255,0.07)'
              }`,
              borderRadius: 14,
              padding: '14px 16px',
              cursor: 'grab',
              boxShadow: snapshot.isDragging
                ? '0 12px 40px rgba(108,99,255,0.3)'
                : isOverdue
                ? '0 2px 8px rgba(255,92,92,0.08)'
                : '0 2px 8px rgba(0,0,0,0.2)',
              transform: snapshot.isDragging
                ? `${provided.draggableProps.style?.transform} rotate(1.5deg)`
                : provided.draggableProps.style?.transform,
              transition: snapshot.isDragging ? 'none' : 'border-color 0.2s, box-shadow 0.2s',
            }}
            className="task-card-wrap"
          >
            <style>{`
              .task-card-wrap .action-btns { opacity: 0; transition: opacity 0.15s; }
              .task-card-wrap:hover .action-btns { opacity: 1; }
              .task-card-wrap:hover { border-color: rgba(255,255,255,0.14) !important; }
              .task-icon-btn {
                width: 24px; height: 24px; border-radius: 6px; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                font-size: 11px; border: none; transition: all 0.15s;
              }
            `}</style>

            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: task.title ? 8 : 10 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                padding: '3px 8px', borderRadius: 6,
                color: priority.color, background: priority.bg,
                border: `1px solid ${priority.border}`,
                fontFamily: 'Space Mono, monospace',
              }}>
                {priority.label}
              </span>
              <div className="action-btns" style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={handleEdit}
                  className="task-icon-btn"
                  style={{ background: 'rgba(108,99,255,0.12)', color: '#6c63ff', border: '1px solid rgba(108,99,255,0.25)' }}
                  title="Edit task"
                >✏</button>
                <button
                  onClick={handleDelete}
                  className="task-icon-btn"
                  style={{ background: 'rgba(255,92,92,0.1)', color: '#ff7070', border: '1px solid rgba(255,92,92,0.2)' }}
                  title="Delete task"
                >✕</button>
              </div>
            </div>

            {/* Title */}
            {task.title && (
              <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: '#e8eaf0', lineHeight: 1.4 }}>
                {task.title}
              </p>
            )}

            {/* Content */}
            <p style={{
              fontSize: 13, color: task.title ? '#8b90a7' : '#d4d7e3',
              lineHeight: 1.6, margin: '0 0 12px', wordBreak: 'break-word',
            }}>
              {task.content}
            </p>

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)',
              flexWrap: 'wrap', gap: 6,
            }}>
              <span style={{ fontSize: 11, color: '#555a72', fontFamily: 'Space Mono, monospace' }}>
                {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Due date badge */}
                {dueDateState && dueStyle && (
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    padding: '2px 7px', borderRadius: 5,
                    color: dueStyle.color, background: dueStyle.bg,
                    border: `1px solid ${dueStyle.border}`,
                    fontFamily: 'Space Mono, monospace',
                    display: 'flex', alignItems: 'center', gap: 3,
                  }}>
                    {dueStyle.icon} {dueDateState.label}
                  </span>
                )}
                {/* Assignee avatar */}
                {task.assignee?.name && (
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: '#6c63ff',
                  }} title={task.assignee.name}>
                    {task.assignee.name[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {showEdit && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => { onUpdate(updated); setShowEdit(false); }}
        />
      )}
    </>
  );
};

export default TaskCard;