import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './index.scss';
import Movie from './Movie';
import Serie from './Serie';
import { useTranslation } from 'react-i18next';

const Research = () => {
  let location = useLocation();
  const { t } = useTranslation();
  const movieRef = useRef(null);
  const seriesRef = useRef(null);
  const navLinksRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [componentToShow, setComponentToShow] = useState(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      // Appeler updateIndicator en fonction de l'URL active
      if (location.pathname.includes('/movies')) {
        updateIndicator(movieRef);
      } else if (location.pathname.includes('/series')) {
        updateIndicator(seriesRef);
      }
    });

    // Observer les changements de taille de l'élément nav-links
    if (navLinksRef.current) {
      resizeObserver.observe(navLinksRef.current);
    }

    // Nettoyer l'observateur lors du démontage
    return () => {
      if (navLinksRef.current) {
        resizeObserver.unobserve(navLinksRef.current);
      }
    };
  }, [location]);

  const updateIndicator = (ref) => {
    // Vérifier que ref.current existe avant de continuer
    if (!ref.current) {
      return;
    }

    if (ref.current === movieRef.current) {
      setIndicatorStyle({
        width: `${ref.current.offsetWidth}px`,
        height: `${ref.current.offsetHeight + 1}px`,
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0',
        borderTopLeftRadius: '40px',
        borderBottomLeftRadius: '40px',
        transform: `translateX(${ref.current.offsetLeft - 2}px)`
      });
    } else if (ref.current === seriesRef.current) {
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

  useEffect(() => {
    const showComponentBasedOnPath = () => {
      const basePath = '/research';
      if (location.pathname === basePath || location.pathname === `${basePath}/movies`) {
        if (location.pathname === basePath) {
          location.pathname = `${basePath}/movies`;
        }
        setComponentToShow(<Movie />);
      } else if (location.pathname === `${basePath}/series`) {
        setComponentToShow(<Serie />);
      }
    };

    showComponentBasedOnPath();
  }, [location.pathname]);

  return (
    <main className="main-container">
      <div className="nav-links" ref={navLinksRef}>
        <div className="indicator" style={indicatorStyle}></div>
        <NavLink to="./movies" className="section-nav" ref={movieRef} onClick={() => updateIndicator(movieRef)}>
          {t('commun.movies')}
        </NavLink>
        <NavLink to="./series" className="section-nav" ref={seriesRef} onClick={() => updateIndicator(seriesRef)}>
          {t('commun.series')}
        </NavLink>
      </div>
      {componentToShow}
    </main>
  );
};

export default Research;
