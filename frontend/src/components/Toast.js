import { useState, useCallback } from 'react';

let toastFn = null;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  toastFn = addToast;
  return { toasts, addToast };
}

export function toast(type, title, message) {
  if (toastFn) toastFn(type, title, message);
}

const icons = { success: '✅', error: '❌', info: 'ℹ️' };

export function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast-icon">{icons[t.type]}</span>
          <div className="toast-text">
            <div className="toast-title">{t.title}</div>
            {t.message && <div className="toast-msg">{t.message}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
