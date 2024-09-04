import React from 'react';
import './contact.scss';
import { t } from 'i18next';
import StyledComponents from '../../assets/inputs';

const Contact = () => {
  const historyBack = () => {
    window.history.back();
  };

  return (
    <>
      <div className="button-back">
        <StyledComponents.CssButtonContained onClick={historyBack}>{t('error.go-back')}</StyledComponents.CssButtonContained>
      </div>
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
    </>
  );
};
export default Contact;
