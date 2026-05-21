import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/login', form);
      localStorage.setItem('user_id', res.data.user_id);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left branding panel */}
      <div className="auth-panel auth-panel--left">
        <div className="auth-brand animate-fade-up">
          <div className="auth-brand-logo">🏠</div>
          <h1>ServeEase</h1>
          <p>Your trusted home service partner</p>
        </div>
        <div className="auth-features animate-fade-up delay-2">
          {[
            { icon: '⚡', text: 'Instant service booking' },
            { icon: '🔒', text: 'Secure & trusted professionals' },
            { icon: '📍', text: 'Real-time request tracking' },
            { icon: '⭐', text: '50,000+ happy customers' },
          ].map((f, i) => (
            <div className="auth-feature-item" key={i}>
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-panel">
        <div className="auth-card animate-fade-up">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to manage your service requests</p>

          {error && (
            <div className="toast toast--error" style={{ marginBottom: 20, position: 'static', minWidth: 'unset', animation: 'none' }}>
              <span className="toast-icon">❌</span>
              <div className="toast-text">
                <div className="toast-title">Login failed</div>
                <div className="toast-msg">{error}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn--primary btn--full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Signing in…</> : 'Sign in →'}
            </button>
          </form>

          <div className="auth-link">
            Don't have an account?{' '}
            <Link to="/register">Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
