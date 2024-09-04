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
        {/* Introduction */}
        <section className="about-section">
          <h2>{t('about.introduction-title')}</h2>
          <p>{t('about.introduction-text')}</p>
        </section>

        {/* Technologies Utilisées */}
        <section className="about-section">
          <h2>{t('about.technologies-title')}</h2>
          <p>{t('about.technologies-text')}</p>
          <ul>
            <li>{t('about.technology-frontend')}</li>
            <li>{t('about.technology-backend')}</li>
            <li>{t('about.technology-database')}</li>
            <li>{t('about.technology-tools')}</li>
            <li>{t('about.technology-deployment')}</li>
          </ul>
        </section>

        {/* Processus de Développement */}
        <section className="about-section">
          <h2>{t('about.process-title')}</h2>
          <p>{t('about.process-text')}</p>
          <ul>
            <li>{t('about.process-step1')}</li>
            <li>{t('about.process-step2')}</li>
            <li>{t('about.process-step3')}</li>
            <li>{t('about.process-step4')}</li>
            <li>{t('about.process-step5')}</li>
            <li>{t('about.process-step6')}</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default About;
