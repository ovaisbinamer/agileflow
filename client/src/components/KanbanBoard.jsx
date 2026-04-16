// File: client/src/components/KanbanBoard.jsx
import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import useSocket from '../hooks/useSocket';
import api from '../api/axios';

const COLUMNS = [
  { id: 'todo',       title: 'To Do',       accentColor: '#6c63ff', bg: 'rgba(108,99,255,0.08)' },
  { id: 'inprogress', title: 'In Progress',  accentColor: '#f5a623', bg: 'rgba(245,166,35,0.08)' },
  { id: 'done',       title: 'Done',         accentColor: '#4caf50', bg: 'rgba(76,175,80,0.08)'  },
];

const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const KanbanBoard = ({ boardId }) => {
  const socket = useSocket();
  const [tasks, setTasks] = useState({ todo: [], inprogress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ content: '', priority: 'medium' });
  const [addingTask, setAddingTask] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);

  const normalizeTasks = (taskArray) => {
    const buckets = { todo: [], inprogress: [], done: [] };
    taskArray.forEach((t) => { if (buckets[t.columnId]) buckets[t.columnId].push(t); });
    Object.keys(buckets).forEach((col) => buckets[col].sort((a, b) => a.order - b.order));
    return buckets;
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/tasks?boardId=${boardId}`);
        setTasks(normalizeTasks(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (boardId) fetchTasks();
  }, [boardId]);

  useEffect(() => {
    if (!socket || !boardId) return;
    socket.emit('join-board', boardId);

    const handleRemoteMove = (payload) => {
      setTasks((prev) => {
        const next = { todo: [...prev.todo], inprogress: [...prev.inprogress], done: [...prev.done] };
        const { taskId, sourceColumnId, destinationColumnId, destinationIndex } = payload;
        const taskIndex = next[sourceColumnId].findIndex((t) => t._id === taskId);
        if (taskIndex === -1) return prev;
        const [moved] = next[sourceColumnId].splice(taskIndex, 1);
        moved.columnId = destinationColumnId;
        next[destinationColumnId].splice(destinationIndex, 0, moved);
        return next;
      });
    };

    const handleRemoteCreate = (task) => {
      setTasks((prev) => ({ ...prev, [task.columnId]: [...(prev[task.columnId] || []), task] }));
    };

    const handleRemoteUpdate = (updatedTask) => {
      setTasks((prev) => {
        const next = { ...prev };
        for (const col of Object.keys(next)) {
          const idx = next[col].findIndex((t) => t._id === updatedTask._id);
          if (idx !== -1) {
            next[col] = [...next[col]];
            next[col][idx] = updatedTask;
            return next;
          }
        }
        return prev;
      });
    };

    const handleRemoteDelete = ({ taskId, columnId }) => {
      setTasks((prev) => ({ ...prev, [columnId]: prev[columnId].filter((t) => t._id !== taskId) }));
    };

    socket.on('task-moved', handleRemoteMove);
    socket.on('task-created', handleRemoteCreate);
    socket.on('task-updated', handleRemoteUpdate);
    socket.on('task-deleted', handleRemoteDelete);

    return () => {
      socket.emit('leave-board', boardId);
      socket.off('task-moved', handleRemoteMove);
      socket.off('task-created', handleRemoteCreate);
      socket.off('task-updated', handleRemoteUpdate);
      socket.off('task-deleted', handleRemoteDelete);
    };
  }, [socket, boardId]);

  const onDragEnd = useCallback(async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const srcCol = source.droppableId;
    const dstCol = destination.droppableId;

    setTasks((prev) => {
      const next = { todo: [...prev.todo], inprogress: [...prev.inprogress], done: [...prev.done] };
      if (srcCol === dstCol) {
        next[srcCol] = reorder(next[srcCol], source.index, destination.index);
      } else {
        const [moved] = next[srcCol].splice(source.index, 1);
        moved.columnId = dstCol;
        next[dstCol].splice(destination.index, 0, moved);
      }
      return next;
    });

    if (socket) socket.emit('task-moved', {
      boardId,
      taskId: draggableId,
      sourceColumnId: srcCol,
      destinationColumnId: dstCol,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    });

    try {
      await api.put(`/tasks/${draggableId}`, { columnId: dstCol, order: destination.index });
    } catch (err) {
      console.error('Failed to persist task move:', err);
    }
  }, [socket, boardId]);

  const handleCreateTask = async (columnId) => {
    if (!newTask.content.trim()) return;
    try {
      setAddingTask(true);
      const { data: task } = await api.post('/tasks', {
        content: newTask.content,
        boardId,
        columnId,
        priority: newTask.priority,
      });
      setTasks((prev) => ({ ...prev, [columnId]: [...prev[columnId], task] }));
      if (socket) socket.emit('task-created', { boardId, task });
      setNewTask({ content: '', priority: 'medium' });
      setActiveColumn(null);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingTask(false);
    }
  };

  const handleUpdateTask = useCallback((updatedTask) => {
    setTasks((prev) => {
      const next = { ...prev };
      for (const col of Object.keys(next)) {
        const idx = next[col].findIndex((t) => t._id === updatedTask._id);
        if (idx !== -1) {
          next[col] = [...next[col]];
          next[col][idx] = updatedTask;
          return next;
        }
      }
      return prev;
    });
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    setTasks((prev) => {
      const next = { ...prev };
      let foundColumn = null;
      for (const col of Object.keys(next)) {
        const idx = next[col].findIndex((t) => t._id === taskId);
        if (idx !== -1) {
          foundColumn = col;
          next[col] = next[col].filter((t) => t._id !== taskId);
          break;
        }
      }
      if (foundColumn && socket) socket.emit('task-deleted', { boardId, taskId, columnId: foundColumn });
      return next;
    });
  }, [socket, boardId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: '#6c63ff',
              animation: `bounce 0.8s ease ${i * 0.15}s infinite`,
            }} />
          ))}
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .task-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #e8eaf0;
          outline: none;
          resize: none;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .task-input:focus { border-color: #6c63ff; background: rgba(108,99,255,0.06); }
        .task-input::placeholder { color: rgba(139,144,167,0.5); }
        .priority-select {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 6px 10px;
          color: #8b90a7;
          font-size: 12px;
          outline: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          flex: 1;
        }
      `}</style>

      {/* Three Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          alignItems: 'start',
        }}>
          {COLUMNS.map((col, colIdx) => {
            const colTasks = tasks[col.id] || [];
            const isAddingHere = activeColumn === col.id;

            return (
              <div
                key={col.id}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: '#13161e',
                  border: '1px solid rgba(255,255,255,0.06)',
                  animation: `fadeInUp 0.4s ease ${colIdx * 0.08}s forwards`,
                  opacity: 0,
                }}
              >
                {/* Color accent top bar */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${col.accentColor}, transparent)` }} />

                {/* Column Header */}
                <div style={{
                  padding: '18px 20px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 9, height: 9, borderRadius: '50%',
                      background: col.accentColor,
                      boxShadow: `0 0 8px ${col.accentColor}`,
                    }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#e8eaf0', letterSpacing: '-0.2px' }}>
                      {col.title}
                    </span>
                    <div style={{
                      minWidth: 22, height: 22, borderRadius: 6, padding: '0 6px',
                      background: `${col.accentColor}20`,
                      border: `1px solid ${col.accentColor}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: col.accentColor,
                      fontFamily: 'Space Mono, monospace',
                    }}>
                      {colTasks.length}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveColumn(isAddingHere ? null : col.id);
                      setNewTask({ content: '', priority: 'medium' });
                    }}
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      border: 'none', cursor: 'pointer',
                      background: isAddingHere ? col.accentColor : 'rgba(255,255,255,0.06)',
                      color: isAddingHere ? '#fff' : '#8b90a7',
                      fontSize: 18,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', lineHeight: 1,
                    }}
                  >
                    {isAddingHere ? '×' : '+'}
                  </button>
                </div>

                {/* Add Task Form */}
                {isAddingHere && (
                  <div style={{
                    margin: '12px 16px',
                    padding: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${col.accentColor}30`,
                    borderRadius: 14,
                    animation: 'fadeInUp 0.25s ease forwards',
                  }}>
                    <textarea
                      autoFocus
                      rows={3}
                      className="task-input"
                      placeholder="What needs to be done?"
                      value={newTask.content}
                      onChange={(e) => setNewTask(p => ({ ...p, content: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCreateTask(col.id);
                        }
                      }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <select
                        className="priority-select"
                        value={newTask.priority}
                        onChange={(e) => setNewTask(p => ({ ...p, priority: e.target.value }))}
                      >
                        {PRIORITY_OPTIONS.map(p => (
                          <option key={p} value={p}>
                            {p.charAt(0).toUpperCase() + p.slice(1)} Priority
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleCreateTask(col.id)}
                        disabled={!newTask.content.trim() || addingTask}
                        style={{
                          padding: '6px 18px', borderRadius: 8,
                          border: 'none', cursor: 'pointer',
                          background: col.accentColor, color: '#fff',
                          fontSize: 12, fontWeight: 600,
                          fontFamily: 'DM Sans, sans-serif',
                          transition: 'opacity 0.2s',
                          opacity: !newTask.content.trim() || addingTask ? 0.5 : 1,
                        }}
                      >
                        {addingTask ? '...' : 'Add Task'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Droppable Task List */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: 120,
                        padding: '8px 12px 12px',
                        background: snapshot.isDraggingOver ? col.bg : 'transparent',
                        transition: 'background 0.2s',
                      }}
                    >
                      {colTasks.map((task, index) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          index={index}
                          onDelete={handleDeleteTask}
                          onUpdate={handleUpdateTask}
                        />
                      ))}
                      {provided.placeholder}

                      {/* Empty state */}
                      {colTasks.length === 0 && !snapshot.isDraggingOver && !isAddingHere && (
                        <div style={{
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center',
                          padding: '32px 16px', gap: 8,
                        }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            border: `1.5px dashed ${col.accentColor}40`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <span style={{ fontSize: 18, opacity: 0.3 }}>+</span>
                          </div>
                          <p style={{ fontSize: 12, color: '#555a72', textAlign: 'center', margin: 0 }}>
                            No tasks yet
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;