import { useState, useEffect } from 'react';

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="install-banner">
      <img src="/logo.svg.jpg" alt="Smart Tribut" className="install-icon" />
      <div className="install-text">
        <strong>Instalar Smart Tribut</strong>
        <span>Añade la app a tu pantalla de inicio</span>
      </div>
      <button className="btn-install" onClick={handleInstall}>Instalar</button>
      <button className="btn-install-close" onClick={() => setShow(false)}>✕</button>
    </div>
  );
}
