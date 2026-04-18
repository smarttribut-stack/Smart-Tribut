import type React from 'react';
import { type Lang, translations } from '../i18n';

interface PaywallModalProps {
  lang: Lang;
  onClose: () => void;
  onSubscribe: () => void;
}

export function PaywallModal({ lang, onClose, onSubscribe }: PaywallModalProps) {
  const t = translations[lang];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal paywall-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="paywall-icon">🔒</div>
        <h2 className="modal-title">{t.paywallTitle}</h2>
        <p className="modal-subtitle">{t.paywallSubtitle}</p>

        <div className="paywall-plan">
          <div className="paywall-plan-header">
            <span className="paywall-plan-name">{t.planProName}</span>
            <span className="paywall-plan-badge">{t.planProBadge}</span>
          </div>
          <div className="paywall-price">
            <span className="paywall-amount">€9.99</span>
            <span className="paywall-period">{t.planProPrice}</span>
          </div>
          <ul className="paywall-features">
            {(t.planProFeatures as string[]).map((f, i) => (
              <li key={i}><span className="check check-pro">✓</span>{f}</li>
            ))}
          </ul>
        </div>

        <button className="btn-paywall-subscribe" onClick={onSubscribe}>
          {t.paywallCta}
        </button>
        <p className="paywall-note">{t.paywallNote}</p>
      </div>
    </div>
  );
}
