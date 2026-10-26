import { useState, useEffect } from 'react';
import { UserCheck, Search, Plus, Pencil, Trash2, X, Briefcase } from 'lucide-react';

export default function WiremanMasters({ token, user }) {
  const [wiremen, setWiremen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', experience: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletePrompt, setDeletePrompt] = useState(null); // { id, name }
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const isAdmin = (user?.role || '').trim().toLowerCase() === 'admin';

  const fetchWiremen = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${window.API_BASE}/api/wireman-masters`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWiremen(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch wireman masters:', res.statusText);
      }
    } catch (err) {
      console.error('Error fetching wireman masters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWiremen();
  }, [token]);

  // Alt+N keyboard shortcut to open modal for Admins
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'n' && isAdmin) {
        e.preventDefault();
        openCreateModal();
      }
      if (e.key === 'Escape') {
        if (deletePrompt) setDeletePrompt(null);
        if (showModal) closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, showModal, deletePrompt]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', experience: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (wireman) => {
    setEditingId(wireman.id);
    setFormData({ name: wireman.name || '', experience: wireman.experience || '' });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', experience: '' });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setFormError('Wireman name is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const url = editingId 
        ? `${window.API_BASE}/api/wireman-masters/${editingId}`
        : `${window.API_BASE}/api/wireman-masters`;
      
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: trimmedName,
          experience: formData.experience.trim()
        })
      });

      if (res.ok) {
        closeModal();
        await fetchWiremen();
      } else {
        const data = await res.json().catch(() => ({}));
        setFormError(data.error || 'Failed to save wireman record.');
      }
    } catch (err) {
      console.error('Error saving wireman:', err);
      setFormError('Network error while saving wireman.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (id, name) => {
    setIsDeleting(true);
    setActionNotice(null);

    try {
      const res = await fetch(`${window.API_BASE}/api/wireman-masters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setDeletePrompt(null);
        await fetchWiremen();
        setActionNotice({ type: 'success', message: `Wireman "${name}" was deleted successfully.` });
        setTimeout(() => setActionNotice(null), 3500);
      } else {
        const data = await res.json().catch(() => ({}));
        setActionNotice({ type: 'error', message: data.error || 'Failed to delete wireman.' });
      }
    } catch (err) {
      console.error('Error deleting wireman:', err);
      setActionNotice({ type: 'error', message: 'Network error while deleting wireman.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredWiremen = wiremen.filter((w) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (w.name || '').toLowerCase().includes(q) ||
      (w.experience || '').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={22} style={{ color: 'var(--blue)' }} />
            <h2 style={{ margin: 0, color: 'var(--text)' }}>Wireman Masters</h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text3)' }}>
            Shop-floor electrical operators directory for panel wiring, manufacturing, and scheduling.
          </p>
        </div>
        {isAdmin && (
          <button
            className="vbtn"
            onClick={openCreateModal}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Add Wireman (Alt+N)
          </button>
        )}
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: actionNotice.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${actionNotice.type === 'error' ? 'var(--red)' : '#10b981'}`,
            color: actionNotice.type === 'error' ? 'var(--red)' : '#10b981'
          }}
        >
          <span>{actionNotice.message}</span>
          <button
            onClick={() => setActionNotice(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0 4px' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search & Top Action Bar just above the table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ maxWidth: '420px', width: '100%', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search wiremen by name or experience..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'var(--bg2)' }}
          />
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text3)',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* Right-aligned Confirm & Cancel Delete Toast */}
        {deletePrompt && (
          <div
            style={{
              background: 'var(--bg2)',
              border: '1px solid rgba(239, 68, 68, 0.45)',
              borderLeft: '4px solid var(--red)',
              borderRadius: '10px',
              padding: '10px 18px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(239, 68, 68, 0.15)',
              marginLeft: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Trash2 size={18} style={{ color: 'var(--red)', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                Delete <strong>{deletePrompt.name}</strong>?
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="vbtn"
                onClick={() => setDeletePrompt(null)}
                disabled={isDeleting}
                style={{
                  padding: '6px 14px',
                  fontSize: '13px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--text2)'
                }}
              >
                Cancel
              </button>
              <button
                className="vbtn"
                onClick={() => confirmDelete(deletePrompt.id, deletePrompt.name)}
                disabled={isDeleting}
                style={{
                  padding: '6px 18px',
                  fontSize: '13px',
                  background: 'var(--red)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '600'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wiremen Table */}
      <div style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)', color: 'var(--text3)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', width: '80px' }}>SR No.</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', minWidth: '220px' }}>Wireman Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', minWidth: '180px' }}>Experience</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', minWidth: '140px' }}>Created Date</th>
              {isAdmin && (
                <th style={{ padding: '12px 16px', textAlign: 'right', width: '140px' }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} style={{ padding: '36px', textAlign: 'center', color: 'var(--text3)' }}>
                  Loading wiremen directory...
                </td>
              </tr>
            ) : filteredWiremen.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>
                  {searchTerm
                    ? 'No wiremen match your search.'
                    : 'No wiremen registered yet. Click "+ Add Wireman" to register a new wireman.'}
                </td>
              </tr>
            ) : (
              filteredWiremen.map((w, idx) => (
                <tr key={w.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--text3)' }}>{idx + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(59, 130, 246, 0.15)',
                          color: 'var(--blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        {(w.name || 'W').charAt(0).toUpperCase()}
                      </div>
                      <span>{w.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text2)' }}>
                    {w.experience ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          color: '#10b981'
                        }}
                      >
                        <Briefcase size={12} />
                        {w.experience}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text3)', fontStyle: 'italic', fontSize: '12px' }}>
                        —
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text3)', fontSize: '12px' }}>
                    {w.created_at ? new Date(w.created_at).toLocaleDateString('en-IN') : '—'}
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          className="vbtn"
                          onClick={() => { setDeletePrompt(null); openEditModal(w); }}
                          title="Edit Wireman"
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            background: 'var(--bg3)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          className="vbtn"
                          onClick={() => setDeletePrompt({ id: w.id, name: w.name })}
                          title="Delete Wireman"
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            background: deletePrompt?.id === w.id ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.1)',
                            border: deletePrompt?.id === w.id ? '1px solid var(--red)' : '1px solid rgba(239, 68, 68, 0.3)',
                            color: 'var(--red)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '18px' }}>
                {editingId ? 'Edit Wireman' : 'Add New Wireman'}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text3)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid var(--red)',
                  color: 'var(--red)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  marginBottom: '16px'
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px' }}>
                  Wireman Name <span style={{ color: 'var(--red)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--bg)' }}
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px' }}>
                  Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 Years, Senior Wireman, 2.5 Yrs"
                  className="form-input"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--bg)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="vbtn"
                  onClick={closeModal}
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="vbtn"
                  disabled={saving}
                  style={{ minWidth: '90px' }}
                >
                  {saving ? 'Saving...' : (editingId ? 'Update' : 'Add Wireman')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
