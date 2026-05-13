import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import { translations, type Lang } from './i18n';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Sidebar, type ChatSession } from './components/Sidebar';
import { PaywallModal } from './components/PaywallModal';
import { Toast, type ToastMessage } from './components/Toast';
import { VoiceButton } from './components/VoiceButton';
import { DataTable } from './components/DataTable';
import { InstallBanner } from './components/InstallBanner';

type View = 'landing' | 'chat';

interface Message {
  id: string;
  type: 'query' | 'response';
  content: string;
  timestamp: Date;
}

interface User {
  name: string;
  email: string;
  freeQueriesLeft: number;
  isPro?: boolean;
  plan?: 'free' | 'pro' | 'business' | 'enterprise';
}

const flags: Record<Lang, string> = { es: '🇪🇸', en: '🇺🇸', fr: '🇫🇷' };

function App() {
  const [view, setView] = useState<View>('landing');
  const [lang, setLang] = useState<Lang>('es');
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setAuthMode(null);
    if (userData.freeQueriesLeft > 0) {
      setShowOnboarding(true);
    }
    addToast(t.loginBtn === 'Iniciar sesión' ? '¡Bienvenido/a!' : 'Welcome!', 'success');
  };

  const handleStartChat = () => {
    setView('chat');
    if (!activeSessionId) startNewSession();
  };

  const startNewSession = () => {
    const id = Date.now().toString();
    setActiveSessionId(id);
    setMessages([]);
  };

  const handleNewSession = () => {
    if (messages.length === 0) return;
    if (confirm(t.confirmNewSession)) {
      saveCurrentSession();
      startNewSession();
    }
  };

  const saveCurrentSession = () => {
    if (messages.length === 0 || !activeSessionId) return;
    const firstQuery = messages.find(m => m.type === 'query');
    if (!firstQuery) return;
    const session: ChatSession = {
      id: activeSessionId,
      title: firstQuery.content.slice(0, 40) + (firstQuery.content.length > 40 ? '...' : ''),
      date: new Date(),
      preview: firstQuery.content.slice(0, 60),
    };
    setSessions(prev => [session, ...prev.filter(s => s.id !== activeSessionId)]);
  };

  const canQuery = () => {
    if (!user) return true; // guest gets 1 free
    if (user.isPro) return true;
    return user.freeQueriesLeft > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!canQuery()) {
      setShowPaywall(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'query',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);
    setShowOnboarding(false);

    // Deduct free query
    if (user && !user.isPro) {
      setUser(prev => prev ? { ...prev, freeQueriesLeft: Math.max(0, prev.freeQueriesLeft - 1) } : prev);
    }

    try {
      const history = messages.map(m => ({
        role: m.type === 'query' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }));

      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentInput, history, plan: user?.plan || 'free' }),
      });

      const data = await res.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'response',
        content: data.response || data.error || 'Error al obtener respuesta.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);

      // Show paywall after free query used
      if (user && !user.isPro && user.freeQueriesLeft <= 1) {
        setTimeout(() => setShowPaywall(true), 1500);
      }
    } catch {
      addToast('Error de conexión. Verifica que el servidor esté activo.', 'error');
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'response',
        content: 'Error de conexión. Verifica que el servidor esté activo.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    setSessions([]);
    setActiveSessionId(null);
    setView('landing');
    addToast('Sesión cerrada', 'info');
  };

  const handleSubscribe = (_plan: 'pro' | 'business' | 'enterprise') => {
    // Stripe integration goes here
    addToast('Redirigiendo a Stripe...', 'info');
    setShowPaywall(false);
  };

  if (view === 'landing') {
    return (
      <>
        <LandingPage
          lang={lang}
          setLang={setLang}
          onStartChat={handleStartChat}
          onLogin={() => setAuthMode('login')}
          onRegister={() => setAuthMode('register')}
        />
        {authMode && (
          <AuthModal
            mode={authMode}
            lang={lang}
            onClose={() => setAuthMode(null)}
            onSuccess={u => { handleAuthSuccess(u); handleStartChat(); }}
            switchMode={setAuthMode}
          />
        )}
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        lang={lang}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={id => {
          setActiveSessionId(id);
          setMessages([]);
        }}
        onNewSession={handleNewSession}
        user={user}
        onUpgrade={() => setShowPaywall(true)}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="chat-area">
        {/* Topbar */}
        <nav className="topbar">
          <button className="btn-menu" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="topbar-brand">
            <img src="/logo.svg.jpg" alt="Smart Tribut" className="topbar-logo" />
            <span className="topbar-title">Smart Tribut</span>
          </div>
          <div className="topbar-actions">
            <div className="lang-selector">
              {(Object.keys(flags) as Lang[]).map(l => (
                <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
                  {flags[l]}
                </button>
              ))}
            </div>
            {user ? (
              <div className="topbar-user">
                {user.isPro && <span className="pro-badge">⭐ Pro</span>}
                {!user.isPro && user.freeQueriesLeft > 0 && (
                  <span className="free-badge">{t.freeQueriesLeft.replace('{n}', String(user.freeQueriesLeft))}</span>
                )}
                <div className="user-avatar-sm">{user.name[0].toUpperCase()}</div>
              </div>
            ) : (
              <button className="btn-ghost-sm" onClick={() => setAuthMode('login')}>{t.login}</button>
            )}
          </div>
        </nav>

        {/* Main */}
        <main className="main">
          {showOnboarding && user && (
            <div className="onboarding-banner">
              <span>🎉</span>
              <div>
                <strong>{t.onboardingTitle.replace('{name}', user.name)}</strong>
                <p>{t.onboardingText}</p>
              </div>
              <button onClick={() => setShowOnboarding(false)}>✕</button>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">
                <img src="/logo.svg.jpg" alt="Smart Tribut" className="welcome-logo" />
              </div>
              <h1 className="welcome-title">Smart Tribut</h1>
              <p className="welcome-subtitle">{t.welcomeSubtitle}</p>
              <div className="welcome-cards">
                <div className="card"><span className="card-icon">📋</span><p>{t.card1}</p></div>
                <div className="card"><span className="card-icon">📚</span><p>{t.card2}</p></div>
                <div className="card"><span className="card-icon">💡</span><p>{t.card3}</p></div>
              </div>
              <p className="disclaimer">{t.disclaimer}</p>
            </div>
          ) : (
            <div className="chat">
              {messages.map(msg => (
                <div key={msg.id} className={`message message-${msg.type}`}>
                  <div className="message-avatar">
                    {msg.type === 'query'
                      ? (user ? user.name[0].toUpperCase() : '👤')
                      : '⚖️'}
                  </div>
                  <div className="message-bubble">
                    <p className="message-content">{msg.content}</p>
                    <span className="message-time">
                      {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message message-response">
                  <div className="message-avatar">⚖️</div>
                  <div className="message-bubble">
                    <div className="typing"><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="footer">
          <form className="input-form" onSubmit={handleSubmit}>
            <input
              className="input-field"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t.placeholder}
              maxLength={500}
              disabled={isLoading}
            />
            <VoiceButton
              isPro={user?.isPro ?? false}
              onTranscript={text => setInput(prev => prev ? prev + ' ' + text : text)}
              onUpgrade={() => setShowPaywall(true)}
              disabled={isLoading}
            />
            <DataTable
              isPro={user?.isPro ?? false}
              onUpgrade={() => setShowPaywall(true)}
            />
            <button className="btn-send" type="submit" disabled={!input.trim() || isLoading}>
              {isLoading ? '...' : '➤'}
            </button>
          </form>
          <p className="footer-note">{t.footerNote}</p>
        </footer>
      </div>

      {authMode && (
        <AuthModal
          mode={authMode}
          lang={lang}
          onClose={() => setAuthMode(null)}
          onSuccess={handleAuthSuccess}
          switchMode={setAuthMode}
        />
      )}
      {showPaywall && (
        <PaywallModal lang={lang} onClose={() => setShowPaywall(false)} onSubscribe={handleSubscribe} />
      )}
      <Toast toasts={toasts} onRemove={removeToast} />
      <InstallBanner />
    </div>
  );
}

export default App;
