import { useState } from 'react';
import axios from 'axios';

const CATEGORIES = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Appliance Repair', 'Pest Control', 'Other'];

function CreateRequest({ refresh, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    preferred_time: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(form).forEach(k => data.append(k, form[k]));
      data.append('user_id', localStorage.getItem('user_id'));
      if (image) data.append('image', image);
      await axios.post('http://127.0.0.1:5000/create-request', data);
      refresh();
      if (onClose) onClose();
    } catch (err) {
      setError('Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="toast toast--error" style={{ marginBottom: 20, position: 'static', minWidth: 'unset', animation: 'none' }}>
          <span className="toast-icon">❌</span>
          <div className="toast-text"><div className="toast-title">{error}</div></div>
        </div>
      )}

      <div className="form-grid">
        <div className="field form-grid--full">
          <label className="field-label">Service Title</label>
          <div className="field-wrapper">
            <span className="field-icon">🏷️</span>
            <input
              type="text"
              className="field-input field-input--icon"
              placeholder="e.g. Fix kitchen tap leak"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field form-grid--full">
          <label className="field-label">Description</label>
          <textarea
            className="field-input"
            placeholder="Describe the issue or what service you need…"
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="field">
          <label className="field-label">Category</label>
          <select
            className="field-input"
            value={form.category}
            onChange={e => set('category', e.target.value)}
            required
          >
            <option value="">Select category…</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="field">
          <label className="field-label">Preferred Time</label>
          <div className="field-wrapper">
            <span className="field-icon">🕐</span>
            <input
              type="text"
              className="field-input field-input--icon"
              placeholder="e.g. Mon 10am–12pm"
              value={form.preferred_time}
              onChange={e => set('preferred_time', e.target.value)}
            />
          </div>
        </div>

        <div className="field form-grid--full">
          <label className="field-label">Service Address</label>
          <div className="field-wrapper">
            <span className="field-icon">📍</span>
            <input
              type="text"
              className="field-input field-input--icon"
              placeholder="Your full address"
              value={form.address}
              onChange={e => set('address', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field form-grid--full">
          <label className="field-label">Attach Image (optional)</label>
          <label className="file-upload-area" style={{ display: 'block', cursor: 'pointer' }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => setImage(e.target.files[0])}
            />
            <div className="upload-icon">{image ? '🖼️' : '📎'}</div>
            <p>{image ? image.name : 'Click to upload or drag & drop'}</p>
          </label>
        </div>
      </div>

      <div className="modal-footer" style={{ padding: '20px 0 0', borderTop: '1px solid var(--border)' }}>
        {onClose && (
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
        )}
        <button type="submit" className="btn btn--primary" disabled={loading} style={{ minWidth: 160 }}>
          {loading
            ? <><span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Creating…</>
            : '✨ Create Request'}
        </button>
      </div>
    </form>
  );
}

export default CreateRequest;
