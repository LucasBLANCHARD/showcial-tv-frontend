import React from 'react';
import './index.scss';
import { t } from 'i18next';
import LogoTmdb from '../../assets/icons/LogoTmdb.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} {t('footer.showcialtv')}. {t('footer.all-rights')}.
        </p>
        <div className="footer-links">
          <a href="/about">{t('footer.about')}</a>
          <a href="/contact">{t('footer.contact')}</a>
          <a href="/privacy">{t('footer.privacy')}</a>
        </div>
      </div>
      <div className="footer-tmdb">
        <p>{t('footer.tmdb')}.</p>
        <img src={LogoTmdb} alt="TMDB Logo" className="tmdb-logo" />
      </div>
    </footer>
  );
};

export default Footer;
