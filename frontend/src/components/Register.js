import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:5000/register', form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-panel auth-panel--left">
        <div className="auth-brand animate-fade-up">
          <div className="auth-brand-logo">🏠</div>
          <h1>ServeEase</h1>
          <p>Your trusted home service partner</p>
        </div>
        <div className="auth-features animate-fade-up delay-2">
          {[
            { icon: '🛠️', text: 'Plumbing, cleaning, electrical & more' },
            { icon: '📅', text: 'Flexible scheduling' },
            { icon: '💳', text: 'Transparent pricing' },
            { icon: '🎯', text: 'Verified & skilled professionals' },
          ].map((f, i) => (
            <div className="auth-feature-item" key={i}>
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card animate-fade-up">
          <h2>Create account</h2>
          <p className="auth-subtitle">Get started with ServeEase — it's free</p>

          {error && (
            <div className="toast toast--error" style={{ marginBottom: 20, position: 'static', minWidth: 'unset', animation: 'none' }}>
              <span className="toast-icon">❌</span>
              <div className="toast-text">
                <div className="toast-title">Registration failed</div>
                <div className="toast-msg">{error}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label">Full name</label>
              <div className="field-wrapper">
                <span className="field-icon">👤</span>
                <input
                  type="text"
                  className="field-input field-input--icon"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label">Email address</label>
              <div className="field-wrapper">
                <span className="field-icon">✉️</span>
                <input
                  type="email"
                  className="field-input field-input--icon"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <div className="field-wrapper">
                <span className="field-icon">🔑</span>
                <input
                  type="password"
                  className="field-input field-input--icon"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button type="submit" className="btn btn--primary btn--full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Creating account…</> : 'Create account →'}
            </button>
          </form>

          <div className="auth-link">
            Already have an account?{' '}
            <Link to="/">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
