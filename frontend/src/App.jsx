import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setTitle('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Toggle status
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedTask = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Update task title
  const handleUpdateTitle = async (id) => {
    if (!editTitle.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle }),
      });
      const updatedTask = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
      setEditingId(null);
      setEditTitle('');
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="logo">
            <span className="logo-icon">📋</span>
            <h1>Student Task Tracker</h1>
          </div>
          <p className="subtitle">Stay organized. Stay productive.</p>
        </header>

        {/* Add Task Form */}
        <form className="task-form" onSubmit={handleAddTask}>
          <input
            id="task-input"
            type="text"
            placeholder="Enter a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button id="add-task-btn" type="submit">
            + Add Task
          </button>
        </form>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-number">
              {tasks.filter((t) => t.status === 'Pending').length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card completed">
            <span className="stat-number">
              {tasks.filter((t) => t.status === 'Completed').length}
            </span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {/* Task List */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎯</span>
              <p>No tasks yet. Add your first task above!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={`task-card ${task.status === 'Completed' ? 'completed' : ''}`}
              >
                <div className="task-left">
                  <button
                    className={`status-toggle ${task.status === 'Completed' ? 'done' : ''}`}
                    onClick={() => handleToggleStatus(task._id, task.status)}
                    title="Toggle status"
                  >
                    {task.status === 'Completed' ? '✓' : ''}
                  </button>

                  {editingId === task._id ? (
                    <div className="edit-group">
                      <input
                        className="edit-input"
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleUpdateTitle(task._id)
                        }
                        autoFocus
                      />
                      <button
                        className="save-btn"
                        onClick={() => handleUpdateTitle(task._id)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setEditingId(null);
                          setEditTitle('');
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`task-title ${task.status === 'Completed' ? 'line-through' : ''}`}
                    >
                      {task.title}
                    </span>
                  )}
                </div>

                <div className="task-right">
                  <span
                    className={`status-badge ${task.status === 'Completed' ? 'badge-done' : 'badge-pending'}`}
                  >
                    {task.status}
                  </span>
                  {editingId !== task._id && (
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingId(task._id);
                        setEditTitle(task.title);
                      }}
                      title="Edit task"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(task._id)}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
