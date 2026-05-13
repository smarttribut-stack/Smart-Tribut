import { useState, useEffect } from 'react';

interface InstallModalProps {
  onClose: () => void;
}

export function InstallModal({ onClose }: InstallModalProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallAndroid = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal install-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="install-modal-icon">📱</div>
        <h2 className="modal-title">Instalar Smart Tribut</h2>
        <p className="modal-subtitle">Añádela a tu pantalla de inicio y úsala como una app</p>

        {/* Android con Chrome */}
        {isAndroid && deferredPrompt && (
          <div className="install-steps">
            <button className="btn-install-direct" onClick={handleInstallAndroid}>
              ⬇ Instalar ahora
            </button>
          </div>
        )}

        {/* Android sin prompt (Chrome ya instalado o Firefox) */}
        {isAndroid && !deferredPrompt && (
          <div className="install-steps">
            <div className="install-step">
              <span className="step-num">1</span>
              <p>Abre este link en <strong>Chrome</strong></p>
            </div>
            <div className="install-step">
              <span className="step-num">2</span>
              <p>Toca el menú <strong>⋮</strong> arriba a la derecha</p>
            </div>
            <div className="install-step">
              <span className="step-num">3</span>
              <p>Selecciona <strong>"Añadir a pantalla de inicio"</strong></p>
            </div>
          </div>
        )}

        {/* iPhone / iPad */}
        {isIOS && (
          <div className="install-steps">
            <div className="install-step">
              <span className="step-num">1</span>
              <p>Abre este link en <strong>Safari</strong></p>
            </div>
            <div className="install-step">
              <span className="step-num">2</span>
              <p>Toca el botón de compartir <strong>⬆</strong> abajo</p>
            </div>
            <div className="install-step">
              <span className="step-num">3</span>
              <p>Selecciona <strong>"Añadir a pantalla de inicio"</strong></p>
            </div>
          </div>
        )}

        {/* PC */}
        {!isIOS && !isAndroid && (
          <div className="install-steps">
            <div className="install-step">
              <span className="step-num">1</span>
              <p>Abre el link en <strong>Chrome</strong> desde tu móvil</p>
            </div>
            <div className="install-step">
              <span className="step-num">2</span>
              <p>Sigue las instrucciones para Android o iPhone</p>
            </div>
          </div>
        )}

        <div className="install-link-box">
          <span className="install-link-label">Link de la app:</span>
          <a
            href="https://smart-tribut-frontend.vercel.app"
            className="install-link"
            target="_blank"
            rel="noreferrer"
          >
            smart-tribut-frontend.vercel.app
          </a>
        </div>
      </div>
    </div>
  );
}
