import React from 'react';
import './privacy.scss'; // Importer les styles spécifiques si nécessaire
import { t } from 'i18next';
import StyledComponents from '../../assets/inputs';

const Privacy = () => {
  const historyBack = () => {
    window.history.back();
  };
  return (
    <>
      <div className="button-back">
        <StyledComponents.CssButtonContained onClick={historyBack}>{t('error.go-back')}</StyledComponents.CssButtonContained>
      </div>
      <div className="privacy-container">
        <h1>{t('footer.privacy')}</h1>
        <p>{t('footer.privacy-text')}.</p>
        <h2>{t('footer.privacy-title-1')}</h2>
        <p>{t('footer.privacy-text-1')}.</p>
        <h2>{t('footer.privacy-title-2')}</h2>
        <p>{t('footer.privacy-text-2')}.</p>
        <h2>{t('footer.privacy-title-3')}</h2>
        <p>{t('footer.privacy-text-3')}.</p>
      </div>
    </>
  );
};

export default Privacy;
