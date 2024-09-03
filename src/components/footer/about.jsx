import React from 'react';
import './about.scss'; // Importer les styles spécifiques si nécessaire
import { t } from 'i18next';

const About = () => {
  return (
    <div className="about-container">
      <h1>{t('footer.about')}</h1>
      <p>{t('footer.about-text')}.</p>
      <p>{t('footer.about-text-2')}.</p>
    </div>
  );
};

export default About;
