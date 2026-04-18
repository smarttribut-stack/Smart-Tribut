import React, { useState } from 'react';
import { type Lang, translations } from '../i18n';

interface AuthModalProps {
  mode: 'login' | 'register';
  lang: Lang;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; freeQueriesLeft: number }) => void;
  switchMode: (mode: 'login' | 'register') => void;
}

export function AuthModal({ mode, lang, onClose, onSuccess, switchMode }: AuthModalProps) {
  const t = translations[lang];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate auth — replace with real API call when backend auth is ready
    await new Promise(r => setTimeout(r, 800));

    if (mode === 'register') {
      onSuccess({ name: name || email.split('@')[0], email, freeQueriesLeft: 1 });
    } else {
      onSuccess({ name: email.split('@')[0], email, freeQueriesLeft: 0 });
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">
          <img src="/logo.svg.jpg" alt="Smart Tribut" />
        </div>
        <h2 className="modal-title">{mode === 'login' ? t.loginTitle : t.registerTitle}</h2>
        <p className="modal-subtitle">{mode === 'register' ? t.registerSubtitle : t.loginSubtitle}</p>

        {error && <div className="modal-error">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label>{t.formName}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.formNamePlaceholder}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>{t.formEmail}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.formEmailPlaceholder}
              required
            />
          </div>
          <div className="form-group">
            <label>{t.formPassword}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t.formPasswordPlaceholder}
              required
              minLength={6}
            />
          </div>
          <button className="btn-modal-submit" type="submit" disabled={loading}>
            {loading ? '...' : (mode === 'login' ? t.loginBtn : t.registerBtn)}
          </button>
        </form>

        <p className="modal-switch">
          {mode === 'login' ? t.noAccount : t.hasAccount}{' '}
          <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? t.registerLink : t.loginLink}
          </button>
        </p>
      </div>
    </div>
  );
}
