import React from 'react';
import './App.scss';
import { useEffect } from 'react';
import { getTheme, initTheme } from './utils/themeManager.ts';
import RoutesConfig from './config/Routes';
import Navbar from './components/navbar/navbar.jsx';
import ErrorBoundary from './components/error_boundary/index.jsx';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/footer/index.jsx';
import { useLocation } from 'react-router-dom';

const App = () => {
  const theme = getTheme();
  const location = useLocation();

  // Vérifier si l'URL actuelle est /activities
  const showFooter = location.pathname !== '/activities';

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Conteneur pour gérer la hauteur de la page */}
        <Navbar />
        <main className="main-content">
          {/* Conteneur principal pour le contenu */}
          <RoutesConfig />
        </main>
        {showFooter && <Footer />}
      </div>
      <ToastContainer autoClose={5000} theme={theme} transition={Zoom} closeOnClick draggable stacked />
    </ErrorBoundary>
  );
};

export default App;
