import { useState, useEffect } from 'react';
import { Users, Shield, Check, X, Loader2, UserPlus, Mail, Lock, User, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'Viewer' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showAddConfirmPassword, setShowAddConfirmPassword] = useState(false);

  // Edit/Delete States
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState({ username: '', email: '', role: '', password: '', confirmPassword: '' });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showEditConfirmPassword, setShowEditConfirmPassword] = useState(false);
  const [editError, setEditError] = useState('');
  const [updatingUser, setUpdatingUser] = useState(false);

  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  const token = localStorage.getItem('token');

  const ROLES = ['Admin', 'Manager', 'Sales', 'Design', 'Purchase', 'Stores', 'Production', 'QC', 'Dispatch', 'Accounts', 'Viewer'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/users", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    if (newUser.password !== newUser.confirmPassword) {
      setError('Passwords do not match');
      setCreating(false);
      return;
    }
    try {
      const { confirmPassword, ...signupData } = newUser;
      const res = await fetch(window.API_BASE + "/api/auth/signup", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(signupData)
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddForm(false);
        setNewUser({ username: '', email: '', password: '', confirmPassword: '', role: 'Viewer' });
        setShowAddPassword(false);
        setShowAddConfirmPassword(false);
        fetchUsers();
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`${window.API_BASE}/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error('Failed to update role', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditUserForm({ username: user.username, email: user.email, role: user.role, password: '', confirmPassword: '' });
    setEditError('');
    setShowEditPassword(false);
    setShowEditConfirmPassword(false);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setIsEditModalOpen(false);
    setShowEditPassword(false);
    setShowEditConfirmPassword(false);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setUpdatingUser(true);
    setEditError('');
    if (editUserForm.password && editUserForm.password !== editUserForm.confirmPassword) {
      setEditError('Passwords do not match');
      setUpdatingUser(false);
      return;
    }
    try {
      const { confirmPassword, ...updateData } = editUserForm;
      const res = await fetch(`${window.API_BASE}/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditModalOpen(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        setEditError(data.error || 'Failed to update user');
      }
    } catch (err) {
      setEditError('Network error');
    } finally {
      setUpdatingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeletingUser(true);
    setDeleteError('');
    try {
      const res = await fetch(`${window.API_BASE}/api/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setUserToDelete(null);
        fetchUsers();
      } else {
        setDeleteError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setDeleteError('Network error');
    } finally {
      setDeletingUser(false);
    }
  };

  if (loading) return <div className="loading-state"><Loader2 className="animate-spin" /> Loading User Directory...</div>;

  return (
    <div className="user-mgmt">
      <div className="mgmt-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={20} />
          <h2>User Management Directory</h2>
          <span className="badge-count">{users.length} Total Accounts</span>
        </div>
        <button className="add-user-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus size={16} />
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-user-form-container">
          <form onSubmit={handleCreateUser} className="add-user-form">
            <div className="form-grid">
              <div className="input-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <User size={14} className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="johndoe" 
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={14} className="input-icon" />
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={14} className="input-icon" />
                  <input 
                    type={showAddPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    aria-label={showAddPassword ? "Hide password" : "Show password"}
                  >
                    {showAddPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={14} className="input-icon" />
                  <input 
                    type={showAddConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowAddConfirmPassword(!showAddConfirmPassword)}
                    aria-label={showAddConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showAddConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="input-group">
                <label>Assign Role</label>
                <select 
                  className="auth-select" 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="submit-user-btn" disabled={creating}>
              {creating ? <Loader2 size={16} className="animate-spin" /> : 'Create User Account'}
            </button>
          </form>
        </div>
      )}

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="u-name">{u.username}</td>
                <td className="u-email">{u.email}</td>
                <td>
                  <span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span>
                </td>
                <td>
                  <div className="action-buttons-cell" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      className="vbtn"
                      onClick={() => openEditModal(u)}
                      style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button 
                      className="vbtn"
                      onClick={() => {
                        setDeleteError('');
                        setUserToDelete(u);
                      }}
                      style={{ 
                        padding: '6px 10px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        borderColor: 'rgba(239,68,68,0.3)',
                        color: 'var(--red)'
                      }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Edit User Details</h3>
                <p className="modal-sub">Modify details for account: {editingUser.username}</p>
              </div>
              <button className="modal-close" onClick={closeEditModal}><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdateUser} className="modal-body">
              <div className="modal-field">
                <label>Username</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editUserForm.username}
                  onChange={(e) => setEditUserForm({...editUserForm, username: e.target.value})}
                  required 
                />
              </div>
              <div className="modal-field">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm({...editUserForm, email: e.target.value})}
                  required 
                />
              </div>
              <div className="modal-field">
                <label>Role</label>
                <select 
                  className="form-select" 
                  value={editUserForm.role}
                  onChange={(e) => setEditUserForm({...editUserForm, role: e.target.value})}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="modal-field">
                <label>New Password (leave blank to keep current)</label>
                <div className="input-wrapper">
                  <Lock size={14} className="input-icon" style={{ left: '12px' }} />
                  <input 
                    type={showEditPassword ? "text" : "password"} 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={editUserForm.password}
                    onChange={(e) => setEditUserForm({...editUserForm, password: e.target.value})}
                    style={{ paddingLeft: '32px', paddingRight: '32px' }}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    style={{ right: '12px' }}
                    aria-label={showEditPassword ? "Hide password" : "Show password"}
                  >
                    {showEditPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="modal-field">
                <label>Confirm New Password</label>
                <div className="input-wrapper">
                  <Lock size={14} className="input-icon" style={{ left: '12px' }} />
                  <input 
                    type={showEditConfirmPassword ? "text" : "password"} 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={editUserForm.confirmPassword || ''}
                    onChange={(e) => setEditUserForm({...editUserForm, confirmPassword: e.target.value})}
                    style={{ paddingLeft: '32px', paddingRight: '32px' }}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowEditConfirmPassword(!showEditConfirmPassword)}
                    style={{ right: '12px' }}
                    aria-label={showEditConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showEditConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              {editError && <div className="form-error" style={{ marginTop: '8px' }}>{editError}</div>}
              <div className="modal-actions" style={{ marginTop: '16px' }}>
                <button type="button" className="btn-cancel" onClick={closeEditModal} disabled={updatingUser}>Cancel</button>
                <button type="submit" className="btn-save" disabled={updatingUser}>
                  {updatingUser ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ color: 'var(--red)' }}>Delete User Account</h3>
                <p className="modal-sub">Are you sure you want to permanently delete this user?</p>
              </div>
              <button className="modal-close" onClick={() => setUserToDelete(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.5' }}>
                Deleting <strong>{userToDelete.username}</strong> ({userToDelete.email}) will remove their account immediately. 
                Any documents uploaded, orders created, or panels assigned to this user will have their references cleared safely.
              </p>
              {deleteError && <div className="form-error" style={{ marginTop: '8px' }}>{deleteError}</div>}
              <div className="modal-actions" style={{ marginTop: '16px' }}>
                <button type="button" className="btn-cancel" onClick={() => setUserToDelete(null)} disabled={deletingUser}>Cancel</button>
                <button 
                  type="button" 
                  className="btn-save" 
                  style={{ background: 'var(--red)', color: '#fff' }} 
                  onClick={handleDeleteUser} 
                  disabled={deletingUser}
                >
                  {deletingUser ? <Loader2 size={16} className="animate-spin" /> : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
