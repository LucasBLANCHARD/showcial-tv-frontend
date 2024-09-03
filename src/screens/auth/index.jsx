import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './index.scss';
import { useTranslation } from 'react-i18next';
import Login from './Login';
import Signup from './Signup';

const Auth = () => {
  let location = useLocation();
  const { t } = useTranslation();
  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const handleResize = () => {
      // Mettre à jour l'indicateur pour l'onglet actif lors du redimensionnement de la fenêtre
      if (location.pathname.includes('/login')) {
        updateIndicator(loginRef);
      } else if (location.pathname.includes('/signup')) {
        updateIndicator(registerRef);
      }
    };

    // Écouter le redimensionnement
    window.addEventListener('resize', handleResize);

    // Mettre à jour une fois lors du montage du composant
    handleResize();

    // Nettoyer l'événement lors du démontage du composant
    return () => window.removeEventListener('resize', handleResize);
  }, [location]);

  const updateIndicator = (ref) => {
    if (ref.current === loginRef.current) {
      setIndicatorStyle({
        width: `${ref.current.offsetWidth}px`,
        height: `${ref.current.offsetHeight + 1}px`,
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0',
        borderTopLeftRadius: '40px',
        borderBottomLeftRadius: '40px',
        transform: `translateX(${ref.current.offsetLeft - 2}px)`
      });
    } else if (ref.current === registerRef.current) {
      setIndicatorStyle({
        width: `${ref.current.offsetWidth}px`,
        height: `${ref.current.offsetHeight + 1}px`,
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0',
        borderTopRightRadius: '40px',
        borderBottomRightRadius: '40px',
        transform: `translateX(${ref.current.offsetLeft + 2}px)`
      });
    }
  };

  const showComponentBasedOnPath = () => {
    const basePath = '/auth';
    if (location.pathname === basePath || location.pathname === `${basePath}/login`) {
      location.pathname = `${basePath}/login`;
      return <Login />;
    } else if (location.pathname === `${basePath}/signup`) {
      return <Signup />;
    }
  };

  return (
    <main className="main-container-auth">
      <div className="card-auth">
        <div className="nav-links-auth">
          <div className="indicator-auth" style={indicatorStyle}></div>
          <NavLink to="./login" className="section-nav-auth" ref={loginRef} onClick={() => updateIndicator(loginRef)}>
            {t('auth.login')}
          </NavLink>
          <NavLink to="./signup" className="section-nav-auth" ref={registerRef} onClick={() => updateIndicator(registerRef)}>
            {t('auth.signup')}
          </NavLink>
        </div>
        {showComponentBasedOnPath()}
      </div>
    </main>
  );
};

export default Auth;
