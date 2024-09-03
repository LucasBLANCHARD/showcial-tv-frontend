import { t } from 'i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const ErrorPage = (error) => {
  let title;
  let description;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  switch (error.error) {
    case 404:
      title = t('error.404');
      description = t('error.404-text');
      break;
    case 500:
      title = t('error.500');
      description = t('error.500-text');
      break;
    default:
      title = t('error.generic');
      description = t('error.generic-text');
      break;
  }
  return (
    <div className="error-container">
      <h1>{title}</h1>
      <p>{description}</p>
      {!token ? (
        <button onClick={() => navigate('/auth')}>{t('error.login')}</button>
      ) : (
        <div>
          <button onClick={() => window.location.reload()}>{t('error.refresh')}</button>
          <button onClick={() => window.history.back()}>{t('error.go-back')}</button>
          <button onClick={() => navigate('/activities')}>{t('error.go-home')}</button>
        </div>
      )}
    </div>
  );
};

export default ErrorPage;
