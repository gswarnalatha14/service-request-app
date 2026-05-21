import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateRequest from './CreateRequest';

const STATUS_META = {
  pending:    { label: 'Pending',     cls: 'badge--pending',    icon: '⏳' },
  inprogress: { label: 'In Progress', cls: 'badge--inprogress', icon: '🔧' },
  completed:  { label: 'Completed',   cls: 'badge--completed',  icon: '✅' },
  cancelled:  { label: 'Cancelled',   cls: 'badge--cancelled',  icon: '❌' },
};

const statusKey = (s = '') => s.toLowerCase().replace(/[\s_-]/g, '');

const NAV_ITEMS = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'requests',  icon: '📋', label: 'My Requests' },
  { id: 'new',       icon: '➕', label: 'New Request' },
];

function SkeletonCard() {
  return (
    <div className="request-card" style={{ gap: 12 }}>
      {[1, 0.6, 0.8, 0.5, 0.7].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: i === 0 ? 20 : 14, width: `${w * 100}%`, marginBottom: 4 }} />
      ))}
    </div>
  );
}

function RequestCard({ req, onDelete, onStatusChange, onEdit }) {
  const meta = STATUS_META[statusKey(req.status)] || STATUS_META.pending;
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    await onStatusChange(req.id, newStatus);
    setUpdatingStatus(false);
  };

  return (
    <div className="request-card animate-fade-up">
      <div className="card-header">
        <h3 className="card-title">{req.title}</h3>
        <span className={`badge ${meta.cls}`}>{meta.label}</span>
      </div>

      {req.description && (
        <p className="card-description">{req.description}</p>
      )}

      <div className="card-meta">
        {req.category && (
          <div className="card-meta-item">
            <span>🏷️</span>
            <span className="card-category">{req.category}</span>
          </div>
        )}
        {req.address && (
          <div className="card-meta-item">
            <span>📍</span>
            <span>{req.address}</span>
          </div>
        )}
        {req.preferred_time && (
          <div className="card-meta-item">
            <span>🕐</span>
            <span>{req.preferred_time}</span>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label className="field-label" style={{ marginBottom: 6 }}>Update Status</label>
        <select
          className="status-select"
          value={statusKey(req.status)}
          onChange={e => handleStatusChange(e.target.value)}
          disabled={updatingStatus}
        >
          {Object.entries(STATUS_META).map(([k, v]) => (
            <option key={k} value={k}>{v.icon} {v.label}</option>
          ))}
        </select>
      </div>

      <div className="card-actions">
        <button className="btn btn--ghost btn--sm" onClick={() => onEdit(req)}>
          ✏️ Edit
        </button>
        <button
          className="btn btn--danger btn--sm"
          onClick={() => onDelete(req.id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

function EditModal({ req, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: req.title || '',
    description: req.description || '',
    category: req.category || '',
    address: req.address || '',
    preferred_time: req.preferred_time || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const CATEGORIES = ['Plumbing','Electrical','Cleaning','Carpentry','Painting','Appliance Repair','Pest Control','Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await axios.put(`http://127.0.0.1:5000/update-request/${req.id}`, form);
      onSaved();
      onClose();
    } catch {
      setError('Could not save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-scale-in">
        <div className="modal-header">
          <div>
            <h3>Edit Request</h3>
            <p>Update service request details</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {error && (
            <div className="toast toast--error" style={{ marginBottom: 16, position: 'static', minWidth: 'unset', animation: 'none' }}>
              <span className="toast-icon">❌</span>
              <div className="toast-text"><div className="toast-title">{error}</div></div>
            </div>
          )}
          <form id="edit-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field form-grid--full">
                <label className="field-label">Title</label>
                <input type="text" className="field-input" value={form.title} onChange={e => set('title', e.target.value)} required />
              </div>
              <div className="field form-grid--full">
                <label className="field-label">Description</label>
                <textarea className="field-input" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
              </div>
              <div className="field">
                <label className="field-label">Category</label>
                <select className="field-input" value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">Select…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Preferred Time</label>
                <input type="text" className="field-input" value={form.preferred_time} onChange={e => set('preferred_time', e.target.value)} />
              </div>
              <div className="field form-grid--full">
                <label className="field-label">Address</label>
                <input type="text" className="field-input" value={form.address} onChange={e => set('address', e.target.value)} />
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" form="edit-form" className="btn btn--primary" disabled={loading}>
            {loading ? <><span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Saving…</> : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editReq, setEditReq] = useState(null);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const user_id = localStorage.getItem('user_id');

  const showToast = (type, title, msg) => {
    setToast({ type, title, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/requests/${user_id}`);
      setRequests(res.data);
    } catch {
      showToast('error', 'Error', 'Could not load requests.');
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const deleteRequest = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete-request/${id}`);
      showToast('success', 'Deleted', 'Request removed successfully.');
      fetchRequests();
    } catch {
      showToast('error', 'Error', 'Could not delete request.');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://127.0.0.1:5000/update-status/${id}`, { status });
      showToast('success', 'Updated', 'Status changed successfully.');
      fetchRequests();
    } catch {
      showToast('error', 'Error', 'Could not update status.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    navigate('/');
  };

  // Stats
  const stats = {
    total:      requests.length,
    pending:    requests.filter(r => statusKey(r.status) === 'pending').length,
    inprogress: requests.filter(r => statusKey(r.status) === 'inprogress').length,
    completed:  requests.filter(r => statusKey(r.status) === 'completed').length,
  };

  const filtered = filter === 'all'
    ? requests
    : requests.filter(r => statusKey(r.status) === filter);

  const navClick = (id) => {
    setActiveNav(id);
    setSidebarOpen(false);
    if (id === 'new') { setShowCreate(true); setActiveNav('requests'); }
  };

  const FILTERS = [
    { key: 'all',        label: `All (${requests.length})` },
    { key: 'pending',    label: `Pending (${stats.pending})` },
    { key: 'inprogress', label: `In Progress (${stats.inprogress})` },
    { key: 'completed',  label: `Completed (${stats.completed})` },
  ];

  const pageTitle = activeNav === 'dashboard' ? 'Dashboard' : 'My Requests';

  return (
    <div className="app-layout">
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast--${toast.type}`}>
            <span className="toast-icon">{toast.type === 'success' ? '✅' : '❌'}</span>
            <div className="toast-text">
              <div className="toast-title">{toast.title}</div>
              {toast.msg && <div className="toast-msg">{toast.msg}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar overlay mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏠</div>
          <span>ServeEase</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => navClick(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">U</div>
            <div className="user-info">
              <div className="user-info-name">My Account</div>
              <div className="user-info-sub">ID: {user_id}</div>
            </div>
          </div>
          <button
            className="btn btn--ghost btn--full"
            style={{ marginTop: 10, fontSize: '0.825rem', padding: '8px' }}
            onClick={handleLogout}
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
            <span className="topbar-title">{pageTitle}</span>
          </div>
          <div className="topbar-actions">
            <span className="topbar-badge">{requests.length} requests</span>
            <button className="btn btn--primary btn--sm" onClick={() => setShowCreate(true)}>
              ✨ New Request
            </button>
          </div>
        </header>

        <div className="page-body">
          {/* Dashboard view */}
          {activeNav === 'dashboard' && (
            <div>
              <div className="section-header" style={{ marginBottom: 28 }}>
                <div>
                  <div className="section-title">Overview</div>
                  <div className="section-subtitle">Your service request summary</div>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-grid">
                {[
                  { cls: 'total',      icon: '📋', value: stats.total,      label: 'Total Requests' },
                  { cls: 'pending',    icon: '⏳', value: stats.pending,    label: 'Pending' },
                  { cls: 'progress',   icon: '🔧', value: stats.inprogress, label: 'In Progress' },
                  { cls: 'done',       icon: '✅', value: stats.completed,  label: 'Completed' },
                ].map((s, i) => (
                  <div key={s.cls} className={`stat-card stat-card--${s.cls} animate-fade-up delay-${i + 1}`}>
                    <div className={`stat-icon stat-icon--${s.cls}`}>{s.icon}</div>
                    <div className="stat-info">
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent requests preview */}
              <div className="section-header">
                <div>
                  <div className="section-title">Recent Requests</div>
                  <div className="section-subtitle">Your latest service requests</div>
                </div>
                <button className="btn btn--ghost btn--sm" onClick={() => setActiveNav('requests')}>
                  View all →
                </button>
              </div>

              {loading ? (
                <div className="requests-grid">
                  {[1,2,3].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : requests.length === 0 ? (
                <div className="empty-state animate-fade-up">
                  <div className="empty-state-icon">🏡</div>
                  <h3>No service requests yet</h3>
                  <p>Create your first service request to get started with ServeEase</p>
                  <button className="btn btn--primary" onClick={() => setShowCreate(true)}>
                    ✨ Create First Request
                  </button>
                </div>
              ) : (
                <div className="requests-grid">
                  {requests.slice(0, 3).map((req, i) => (
                    <RequestCard
                      key={req.id}
                      req={req}
                      onDelete={deleteRequest}
                      onStatusChange={updateStatus}
                      onEdit={setEditReq}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Requests view */}
          {activeNav === 'requests' && (
            <div>
              <div className="section-header" style={{ marginBottom: 20 }}>
                <div>
                  <div className="section-title">My Service Requests</div>
                  <div className="section-subtitle">{filtered.length} request{filtered.length !== 1 ? 's' : ''} found</div>
                </div>
                <button className="btn btn--primary btn--sm" onClick={() => setShowCreate(true)}>
                  ✨ New Request
                </button>
              </div>

              {/* Filter chips */}
              <div className="chip-row">
                {FILTERS.map(f => (
                  <button
                    key={f.key}
                    className={`chip ${filter === f.key ? 'active' : ''}`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="requests-grid">
                  {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty-state animate-fade-up">
                  <div className="empty-state-icon">🔍</div>
                  <h3>{filter === 'all' ? 'No requests yet' : `No ${STATUS_META[filter]?.label || filter} requests`}</h3>
                  <p>{filter === 'all' ? 'Create your first service request to get help at home.' : 'Try a different filter or create a new request.'}</p>
                  {filter === 'all' && (
                    <button className="btn btn--primary" onClick={() => setShowCreate(true)}>✨ Create Request</button>
                  )}
                </div>
              ) : (
                <div className="requests-grid">
                  {filtered.map((req, i) => (
                    <RequestCard
                      key={req.id}
                      req={req}
                      onDelete={deleteRequest}
                      onStatusChange={updateStatus}
                      onEdit={setEditReq}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="modal animate-scale-in">
            <div className="modal-header">
              <div>
                <h3>New Service Request</h3>
                <p>Tell us what you need help with</p>
              </div>
              <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <div className="modal-body">
              <CreateRequest
                refresh={() => { fetchRequests(); showToast('success', 'Created!', 'Service request submitted.'); }}
                onClose={() => setShowCreate(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editReq && (
        <EditModal
          req={editReq}
          onClose={() => setEditReq(null)}
          onSaved={() => { fetchRequests(); showToast('success', 'Saved', 'Request updated successfully.'); }}
        />
      )}
    </div>
  );
}

export default Dashboard;
