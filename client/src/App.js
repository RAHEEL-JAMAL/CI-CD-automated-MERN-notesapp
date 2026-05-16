import React, { useState, useEffect, useCallback } from 'react';

const API = '/api/notes';

const styles = {
  body: {
    margin: 0,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: '#0f1117',
    color: '#e2e8f0',
    minHeight: '100vh',
  },
  header: {
    background: '#1a1d27',
    borderBottom: '1px solid #2d3148',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logo: { fontSize: '1.5rem', fontWeight: 700, color: '#6ee7b7' },
  badge: {
    fontSize: '0.65rem', background: '#2d3148', color: '#94a3b8',
    padding: '2px 8px', borderRadius: '999px', letterSpacing: '0.05em',
  },
  main: { maxWidth: 760, margin: '0 auto', padding: '2rem 1rem' },
  form: {
    background: '#1a1d27', border: '1px solid #2d3148',
    borderRadius: 12, padding: '1.25rem', marginBottom: '2rem',
  },
  formRow: { display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' },
  input: {
    flex: 1, minWidth: 140, background: '#0f1117', border: '1px solid #2d3148',
    color: '#e2e8f0', borderRadius: 8, padding: '0.6rem 0.9rem',
    fontSize: '0.9rem', outline: 'none',
  },
  textarea: {
    width: '100%', background: '#0f1117', border: '1px solid #2d3148',
    color: '#e2e8f0', borderRadius: 8, padding: '0.6rem 0.9rem',
    fontSize: '0.9rem', outline: 'none', resize: 'vertical', minHeight: 72,
    boxSizing: 'border-box', fontFamily: 'inherit',
  },
  btn: {
    background: '#6ee7b7', color: '#0f1117', border: 'none',
    borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600,
    cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap',
  },
  btnDanger: {
    background: 'transparent', color: '#f87171', border: '1px solid #f87171',
    borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem',
  },
  btnEdit: {
    background: 'transparent', color: '#93c5fd', border: '1px solid #93c5fd',
    borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem',
  },
  noteCard: {
    background: '#1a1d27', border: '1px solid #2d3148',
    borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem',
  },
  noteTitle: { fontWeight: 600, fontSize: '1rem', marginBottom: '0.35rem', color: '#f1f5f9' },
  noteContent: { fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.75rem', lineHeight: 1.55 },
  noteMeta: { fontSize: '0.75rem', color: '#475569' },
  noteActions: { display: 'flex', gap: '0.5rem', marginTop: '0.75rem' },
  empty: { textAlign: 'center', color: '#475569', padding: '3rem 0', fontSize: '0.95rem' },
  status: { fontSize: '0.8rem', color: '#f87171', marginTop: '0.5rem' },
  statusOk: { fontSize: '0.8rem', color: '#6ee7b7', marginTop: '0.5rem' },
  sectionTitle: { fontSize: '0.8rem', color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' },
};

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(null); // { id, title, content }
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const flash = (text, err = false) => {
    setMsg(text); setIsError(err);
    setTimeout(() => setMsg(''), 3000);
  };

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setNotes(data);
    } catch {
      flash('Could not reach server. Is it running?', true);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleAdd = async () => {
    if (!title.trim()) return flash('Title is required', true);
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNotes(prev => [data, ...prev]);
      setTitle(''); setContent('');
      flash('Note added ✓');
    } catch (e) { flash(e.message, true); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      setNotes(prev => prev.filter(n => n._id !== id));
      flash('Deleted');
    } catch { flash('Delete failed', true); }
  };

  const startEdit = (note) => setEditing({ id: note._id, title: note.title, content: note.content });

  const handleUpdate = async () => {
    if (!editing.title.trim()) return flash('Title is required', true);
    try {
      const res = await fetch(`${API}/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editing.title, content: editing.content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNotes(prev => prev.map(n => n._id === editing.id ? data : n));
      setEditing(null);
      flash('Updated ✓');
    } catch (e) { flash(e.message, true); }
  };

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <span style={styles.logo}>📝 MERN Notes</span>
        <span style={styles.badge}>MongoDB · Express · React · Node</span>
      </header>

      <main style={styles.main}>
        {/* Add Form */}
        {!editing && (
          <div style={styles.form}>
            <div style={styles.sectionTitle}>New Note</div>
            <div style={styles.formRow}>
              <input
                style={styles.input}
                placeholder="Title *"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              <button style={styles.btn} onClick={handleAdd} disabled={loading}>
                {loading ? '...' : '+ Add'}
              </button>
            </div>
            <textarea
              style={styles.textarea}
              placeholder="Content (optional)"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            {msg && <p style={isError ? styles.status : styles.statusOk}>{msg}</p>}
          </div>
        )}

        {/* Edit Form */}
        {editing && (
          <div style={{ ...styles.form, borderColor: '#93c5fd' }}>
            <div style={{ ...styles.sectionTitle, color: '#93c5fd' }}>Edit Note</div>
            <div style={styles.formRow}>
              <input
                style={styles.input}
                value={editing.title}
                onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
              />
              <button style={styles.btn} onClick={handleUpdate}>Save</button>
              <button style={{ ...styles.btn, background: '#2d3148', color: '#94a3b8' }} onClick={() => setEditing(null)}>Cancel</button>
            </div>
            <textarea
              style={styles.textarea}
              value={editing.content}
              onChange={e => setEditing(p => ({ ...p, content: e.target.value }))}
            />
            {msg && <p style={isError ? styles.status : styles.statusOk}>{msg}</p>}
          </div>
        )}

        {/* Notes List */}
        <div style={styles.sectionTitle}>{notes.length} Note{notes.length !== 1 ? 's' : ''}</div>
        {notes.length === 0
          ? <p style={styles.empty}>No notes yet. Add one above.</p>
          : notes.map(note => (
            <div key={note._id} style={styles.noteCard}>
              <div style={styles.noteTitle}>{note.title}</div>
              {note.content && <div style={styles.noteContent}>{note.content}</div>}
              <div style={styles.noteMeta}>{new Date(note.createdAt).toLocaleString()}</div>
              <div style={styles.noteActions}>
                <button style={styles.btnEdit} onClick={() => startEdit(note)}>Edit</button>
                <button style={styles.btnDanger} onClick={() => handleDelete(note._id)}>Delete</button>
              </div>
            </div>
          ))
        }
      </main>
    </div>
  );
}
