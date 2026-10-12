import React from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App';
import './index.css';
import { I18nProvider } from './i18n/i18nContext';
import { ToastProvider } from './components/common/ToastContext';
import { AttractionsProvider } from './context/AttractionsContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ensureOfficialContent } from './services/officialContent';

// Garantiza el contenido oficial de la exposición en cualquier dispositivo.
ensureOfficialContent();

// Registro de Service Worker para PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        console.log('PWA Service Worker registrado con éxito:', reg.scope);
      })
      .catch((err) => {
        console.warn('Error al registrar Service Worker:', err);
      });
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOMClient.createRoot(rootElement).render(
    <React.StrictMode>
      <I18nProvider>
        <ToastProvider>
          <AttractionsProvider>
            <AdminAuthProvider>
              <App />
            </AdminAuthProvider>
          </AttractionsProvider>
        </ToastProvider>
      </I18nProvider>
    </React.StrictMode>
  );
}
