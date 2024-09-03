import React, { useRef, useEffect, useState } from 'react';
import Spinner from './Loader';
import './LazyImage.scss';

const LazyImage = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const imageRef = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setLoading(true);
          setImageSrc(src);
          // S'assurer que l'image existe avant de désobserver
          if (imageRef.current) {
            observer.unobserve(imageRef.current);
          }
        }
      });
    });

    // S'assurer que l'image existe avant de l'observer
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      // Vérification avant de désobserver lors du nettoyage
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [src]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="spinner-lazy-img">
          <Spinner />
        </div>
      )}
      <img onLoad={handleImageLoad} ref={imageRef} src={imageSrc} alt={alt} />
    </>
  );
};

export default LazyImage;
