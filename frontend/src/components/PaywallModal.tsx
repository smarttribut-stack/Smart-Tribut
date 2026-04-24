import { type Lang, translations } from '../i18n';

interface PaywallModalProps {
  lang: Lang;
  onClose: () => void;
  onSubscribe: (plan: 'pro' | 'business' | 'enterprise') => void;
}

export function PaywallModal({ lang, onClose, onSubscribe }: PaywallModalProps) {
  const t = translations[lang] as any;

  const plans = [
    {
      key: 'pro' as const,
      name: t.planProName,
      price: 'RD$199',
      period: t.planProPrice,
      features: t.planProFeatures as string[],
      badge: t.planProBadge,
      featured: true,
    },
    {
      key: 'business' as const,
      name: t.planBusinessName,
      price: 'RD$349',
      period: t.planBusinessPrice,
      features: t.planBusinessFeatures as string[],
      badge: t.planBusinessBadge,
      featured: false,
    },
    {
      key: 'enterprise' as const,
      name: t.planEnterpriseName,
      price: 'RD$499',
      period: t.planEnterprisePrice,
      features: t.planEnterpriseFeatures as string[],
      badge: t.planEnterpriseBadge,
      featured: false,
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal paywall-modal paywall-modal-wide" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="paywall-icon">🔒</div>
        <h2 className="modal-title">{t.paywallTitle}</h2>
        <p className="modal-subtitle">{t.paywallSubtitle}</p>

        <div className="paywall-plans-grid">
          {plans.map(plan => (
            <div key={plan.key} className={`paywall-plan-card ${plan.featured ? 'paywall-plan-featured' : ''}`}>
              <div className="paywall-plan-header">
                <span className="paywall-plan-name">{plan.name}</span>
                <span className={`paywall-plan-badge ${plan.key === 'enterprise' ? 'badge-enterprise' : ''}`}>{plan.badge}</span>
              </div>
              <div className="paywall-price">
                <span className="paywall-amount">{plan.price}</span>
                <span className="paywall-period">{plan.period}</span>
              </div>
              <ul className="paywall-features">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i}><span className="check check-pro">✓</span>{f}</li>
                ))}
                {plan.features.length > 4 && (
                  <li className="paywall-more">+{plan.features.length - 4} más...</li>
                )}
              </ul>
              <button
                className={`btn-paywall-subscribe ${plan.key === 'enterprise' ? 'btn-enterprise' : ''}`}
                onClick={() => onSubscribe(plan.key)}
              >
                {plan.key === 'enterprise' ? '⭐ ' : '🔓 '}{t.planProCta}
              </button>
            </div>
          ))}
        </div>
        <p className="paywall-note">{t.paywallNote}</p>
      </div>
    </div>
  );
}
