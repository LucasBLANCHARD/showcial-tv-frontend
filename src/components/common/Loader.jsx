import { React, useLayoutEffect, useState } from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';

const Loader = () => {
  const [loaderSize, setLoaderSize] = useState(25); // Taille de départ du loader

  const setLoaderSizeBasedOnScreen = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      setLoaderSize(15);
    } else {
      setLoaderSize(25);
    }
  };

  useLayoutEffect(() => {
    setLoaderSizeBasedOnScreen();
    window.addEventListener('resize', setLoaderSizeBasedOnScreen);
    return () => window.removeEventListener('resize', setLoaderSizeBasedOnScreen);
  }, []);

  return <PacmanLoader color="var(--primary-color)" size={loaderSize} />;
};

export default Loader;
