import React from 'react';
import { type Lang, translations } from '../i18n';

interface LandingPageProps {
  lang: Lang;
  onStartChat: () => void;
  onLogin: () => void;
  onRegister: () => void;
  setLang: (l: Lang) => void;
}

const flags: Record<Lang, string> = { es: '🇪🇸', en: '🇺🇸', fr: '🇫🇷' };

export function LandingPage({ lang, onStartChat, onLogin, onRegister, setLang }: LandingPageProps) {
  const t = translations[lang];

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <img src="/logo.svg.jpg" alt="Smart Tribut" className="nav-logo" />
          <span className="nav-title">Smart Tribut</span>
        </div>
        <div className="landing-nav-actions">
          <div className="lang-selector">
            {(Object.keys(flags) as Lang[]).map(l => (
              <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
                {flags[l]}
              </button>
            ))}
          </div>
          <button className="btn-ghost" onClick={onLogin}>{t.login}</button>
          <button className="btn-primary" onClick={onRegister}>{t.register}</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">{t.heroBadge}</div>
        <h1 className="hero-title">{t.heroTitle}</h1>
        <p className="hero-subtitle">{t.heroSubtitle}</p>
        <div className="hero-actions">
          <button className="btn-hero-primary" onClick={onRegister}>{t.heroCtaPrimary}</button>
          <button className="btn-hero-secondary" onClick={onStartChat}>{t.heroCtaSecondary}</button>
        </div>
        <p className="hero-free-note">{t.heroFreeNote}</p>
      </section>

      {/* Features */}
      <section className="features">
        <h2 className="section-title">{t.featuresTitle}</h2>
        <div className="features-grid">
          {[
            { icon: '⚖️', title: t.feat1Title, desc: t.feat1Desc },
            { icon: '📋', title: t.feat2Title, desc: t.feat2Desc },
            { icon: '🌍', title: t.feat3Title, desc: t.feat3Desc },
            { icon: '🔒', title: t.feat4Title, desc: t.feat4Desc },
            { icon: '📚', title: t.feat5Title, desc: t.feat5Desc },
            { icon: '⚡', title: t.feat6Title, desc: t.feat6Desc },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <h2 className="section-title">{t.pricingTitle}</h2>
        <p className="section-subtitle">{t.pricingSubtitle}</p>
        <div className="pricing-grid">
          {/* Free */}
          <div className="pricing-card">
            <div className="pricing-header">
              <h3 className="plan-name">{t.planFreeName}</h3>
              <div className="plan-price">
                <span className="price-amount">€0</span>
                <span className="price-period">{t.planFreePrice}</span>
              </div>
            </div>
            <ul className="plan-features">
              {(t.planFreeFeatures as string[]).map((f, i) => (
                <li key={i}><span className="check">✓</span>{f}</li>
              ))}
            </ul>
            <button className="btn-plan-secondary" onClick={onRegister}>{t.planFreeCta}</button>
          </div>

          {/* Pro */}
          <div className="pricing-card pricing-card-featured">
            <div className="plan-badge">{t.planProBadge}</div>
            <div className="pricing-header">
              <h3 className="plan-name">{t.planProName}</h3>
              <div className="plan-price">
                <span className="price-amount">€9.99</span>
                <span className="price-period">{t.planProPrice}</span>
              </div>
            </div>
            <ul className="plan-features">
              {(t.planProFeatures as string[]).map((f, i) => (
                <li key={i}><span className="check check-pro">✓</span>{f}</li>
              ))}
            </ul>
            <button className="btn-plan-primary" onClick={onRegister}>{t.planProCta}</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2025 Smart Tribut · {t.footerNote}</p>
      </footer>
    </div>
  );
}
