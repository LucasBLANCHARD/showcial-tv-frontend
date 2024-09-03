import React from 'react';
import './contact.scss'; // Importer les styles spécifiques si nécessaire
import { t } from 'i18next';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>{t('footer.contact')}</h1>
      <p>{t('footer.any-question')}.</p>
      <p>
        <strong>{t('footer.email')}:</strong> {t('footer.my-email')}
      </p>
    </div>
  );
};

export default Contact;
