import React from 'react';
import './contact.scss';
import { t } from 'i18next';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>{t('footer.contact')}</h1>
      <p>{t('footer.any-question')}.</p>
      <p>
        <strong>{t('footer.email')}: </strong> {t('footer.my-email')}
      </p>
      <p>
        <strong>{t('footer.linkedin')}: </strong>
        <a href="https://www.linkedin.com/in/lucas-blchd" target="_blank" rel="noopener noreferrer">
          {t('footer.my-linkedin')}
        </a>
      </p>
    </div>
  );
};
export default Contact;
