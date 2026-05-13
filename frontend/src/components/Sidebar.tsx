import { type Lang, translations } from '../i18n';

export interface ChatSession {
  id: string;
  title: string;
  date: Date;
  preview: string;
}

interface SidebarProps {
  lang: Lang;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  user: { name: string; email: string; freeQueriesLeft: number; isPro?: boolean } | null;
  onUpgrade: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  lang, sessions, activeSessionId, onSelectSession,
  onNewSession, user, onUpgrade, onLogout, isOpen, onClose
}: SidebarProps) {
  const t = translations[lang];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <img src="/logo.svg.jpg" alt="Smart Tribut" className="sidebar-logo" />
          <span className="sidebar-title">Smart Tribut</span>
          <button className="sidebar-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* New chat button */}
        <button className="btn-new-chat" onClick={onNewSession}>
          <span>+</span> {t.newChat}
        </button>

        {/* History */}
        <div className="sidebar-section-label">{t.historyLabel}</div>
        <div className="sidebar-sessions">
          {sessions.length === 0 ? (
            <p className="sidebar-empty">{t.noHistory}</p>
          ) : (
            sessions.map(s => (
              <button
                key={s.id}
                className={`session-item ${activeSessionId === s.id ? 'session-active' : ''}`}
                onClick={() => onSelectSession(s.id)}
              >
                <span className="session-icon">💬</span>
                <div className="session-info">
                  <span className="session-title">{s.title}</span>
                  <span className="session-preview">{s.preview}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* User section */}
        <div className="sidebar-footer">
          {user ? (
            <>
              {!user.isPro && (
                <div className="upgrade-banner">
                  <p className="upgrade-text">
                    {user.freeQueriesLeft > 0
                      ? t.freeQueriesLeft.replace('{n}', String(user.freeQueriesLeft))
                      : t.freeQueriesExhausted}
                  </p>
                  <button className="btn-upgrade" onClick={onUpgrade}>{t.upgradePro}</button>
                </div>
              )}
              {user.isPro && (
                <div className="pro-badge-sidebar">⭐ {t.proPlan}</div>
              )}
              <div className="user-info">
                <div className="user-avatar">{user.name[0].toUpperCase()}</div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                <button className="btn-logout" onClick={onLogout} title={t.logout}>⏻</button>
              </div>
            </>
          ) : (
            <p className="sidebar-guest">{t.guestNote}</p>
          )}
        </div>
      </aside>
    </>
  );
}
