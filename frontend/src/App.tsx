import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { translations, type Lang } from './i18n';

interface Message {
  id: string;
  type: 'query' | 'response';
  content: string;
  timestamp: Date;
}

const flags: Record<Lang, string> = { es: '🇪🇸', en: '🇺🇸', fr: '🇫🇷' };

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<Lang>('es');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'query',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.type === 'query' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }));

      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input.trim(), history }),
      });

      const data = await res.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'response',
        content: data.response || data.error || 'Error al obtener respuesta.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch {
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

  const handleNewSession = () => {
    if (messages.length === 0) return;
    if (confirm(t.confirmNewSession)) setMessages([]);
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="/logo.svg.jpg" alt="Smart Tribut Logo" className="navbar-logo" />
          <span className="navbar-title">Smart Tribut</span>
        </div>
        <div className="navbar-actions">
          {/* Language selector */}
          <div className="lang-selector">
            {(Object.keys(flags) as Lang[]).map(l => (
              <button
                key={l}
                className={`lang-btn ${lang === l ? 'active' : ''}`}
                onClick={() => setLang(l)}
                title={l.toUpperCase()}
              >
                {flags[l]}
              </button>
            ))}
          </div>
          <button className="btn-new-session" onClick={handleNewSession}>
            {t.navNewSession}
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="main">
        {messages.length === 0 ? (
          <div className="welcome">
            <div className="welcome-icon">
              <img src="/logo.svg.jpg" alt="Smart Tribut" className="welcome-logo" />
            </div>
            <h1 className="welcome-title">Smart Tribut</h1>
            <p className="welcome-subtitle">{t.welcomeSubtitle}</p>
            <div className="welcome-cards">
              <div className="card">
                <span className="card-icon">📋</span>
                <p>{t.card1}</p>
              </div>
              <div className="card">
                <span className="card-icon">📚</span>
                <p>{t.card2}</p>
              </div>
              <div className="card">
                <span className="card-icon">💡</span>
                <p>{t.card3}</p>
              </div>
            </div>
            <p className="disclaimer">{t.disclaimer}</p>
          </div>
        ) : (
          <div className="chat">
            {messages.map(msg => (
              <div key={msg.id} className={`message message-${msg.type}`}>
                <div className="message-avatar">
                  {msg.type === 'query' ? '👤' : '⚖️'}
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
                  <div className="typing">
                    <span></span><span></span><span></span>
                  </div>
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
          <button className="btn-send" type="submit" disabled={!input.trim() || isLoading}>
            {isLoading ? '...' : '➤'}
          </button>
        </form>
        <p className="footer-note">{t.footerNote}</p>
      </footer>
    </div>
  );
}

export default App;
