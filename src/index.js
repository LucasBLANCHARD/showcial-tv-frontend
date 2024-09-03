import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import { BrowserRouter as Router } from 'react-router-dom';
import i18n from './i18n';

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'production') {
  console.error = () => null;
  console.warn = () => null; // Désactiver aussi les console.warn en production si nécessaire
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App />
  </Router>
);

// Mettre à jour la méta description après le chargement de la page
const updateMetaDescription = () => {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', i18n.t('site.description'));
  }
};

i18n.on('languageChanged', updateMetaDescription);
