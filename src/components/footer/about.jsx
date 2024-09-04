import React from 'react';
import './about.scss'; // Importer les styles spécifiques si nécessaire
import { t } from 'i18next';
import StyledComponents from '../../assets/inputs';

const About = () => {
  const historyBack = () => {
    window.history.back();
  };
  return (
    <>
      <div className="button-back">
        <StyledComponents.CssButtonContained onClick={historyBack}>{t('error.go-back')}</StyledComponents.CssButtonContained>
      </div>
      <div className="about-container">
        <h1>{t('footer.about')}</h1>
        <p>{t('footer.about-text')}.</p>
        <p>{t('footer.about-text-2')}.</p>
      </div>
    </>
  );
};

export default About;
