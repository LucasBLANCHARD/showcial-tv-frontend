import React, { useEffect, useState } from 'react';
import './navbar.scss';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { set } from 'lodash';

const navLinks = () => [
  {
    titleKey: 'navBar.activities',
    path: '/activities'
  },
  {
    titleKey: 'navBar.research',
    path: '/research'
  },
  {
    titleKey: 'navBar.profile',
    path: `/profile`
  },
  {
    titleKey: 'navBar.settings',
    path: '/settings'
  },
  {
    titleKey: 'navBar.logout',
    path: '/auth',
    onLogout: true
  }
];

const Navbar = () => {
  const [active, setActive] = useState(false);
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        localStorage.removeItem('token');
        setLinks([]);
        navigate('/auth/login');
        return;
      } else if (location.pathname === '/auth/login' || location.pathname === '/auth/signup' || location.pathname === '/auth') {
        navigate('/');
      }
      setLinks(navLinks(decodedToken.userId));
    } else {
      setLinks([]);
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLinks([]);
    setActive(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">{t('navBar.title')}</div>
      <ul className={`navbarNav ${active ? 'active' : ''}`}>{links.length > 0 ? links.map((link, index) => <NavItem key={index} titleKey={link.titleKey} path={link.path} onLogout={link.onLogout} onLogoutHandler={handleLogout} setActive={setActive} />) : null}</ul>
      <div className={`hamburgerIcon ${active ? 'active' : ''} ${!links.length ? 'no-links' : ''}`} onClick={() => setActive(!active)}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  );
};

const NavItem = ({ titleKey, path, onLogout, onLogoutHandler, setActive }) => {
  const { t } = useTranslation();
  const location = useLocation(); // Récupérer l'URL actuelle
  const isOwnProfile = location.pathname === `/profile` || location.pathname === `/profile/followings` || location.pathname === `/profile/followers` || location.pathname.startsWith(`/profile/list`); // Si on est sur son propre profil

  const handleClick = () => {
    if (onLogout) {
      localStorage.removeItem('token');
      onLogoutHandler();
    }
    setActive(false);
  };

  return (
    <li className="navItem">
      <NavLink to={path} onClick={handleClick} className={({ isActive }) => (isActive || (isActive && isOwnProfile) ? 'active' : '')}>
        {t(titleKey)}
      </NavLink>
    </li>
  );
};

export default Navbar;
