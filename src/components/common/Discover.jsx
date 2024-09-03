import React, { useEffect, useState } from 'react';
import './Discover.scss';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import HoverCard from './HoverCard';
import { jwtDecode } from 'jwt-decode';
import { getItemInWatchList } from '../../api';
import LazyImage from './LazyImage';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const Discover = ({ content, mediaType }) => {
  const [items, setItems] = useState([]);
  const [isInWatchlistArray, setIsInWatchlistArray] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchitems = async () => {
      try {
        const response = await content();
        setItems(response.data.results);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      }
    };

    fetchitems();
  }, [content]);

  useEffect(() => {
    // Récupérer les valeurs isInWatchlist pour chaque item dans results
    const fetchIsInWatchlist = async () => {
      const promises = items.map((item) => isAlreadyInWatchlist(item.id));
      const isInWatchlistResults = await Promise.all(promises);
      setIsInWatchlistArray(isInWatchlistResults);
    };

    fetchIsInWatchlist();
  }, [items]); // Mettre à jour lorsque les résultats changent

  const isAlreadyInWatchlist = async (item) => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const isInWatchlist = await getItemInWatchList(decodedToken.userId, item);
      if (isInWatchlist.data) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  const responsive = {
    mobile: { breakpoint: { max: 464, min: 0 }, items: 3, slidesToSlide: 3 },
    tablet: { breakpoint: { max: 1150, min: 464 }, items: 4, slidesToSlide: 4 },
    desktop: { breakpoint: { max: 1450, min: 1150 }, items: 5, slidesToSlide: 5 },
    superLargeDesktop: { breakpoint: { max: 1550, min: 1450 }, items: 6, slidesToSlide: 6 },
    xSuperLargeDesktop: { breakpoint: { max: 3000, min: 1550 }, items: 7, slidesToSlide: 7 }
  };

  const updateNote = () => {
    return;
  };

  const itemsCarousel = items.map((item, index) => {
    // Appelez la fonction isAlreadyInWatchlist pour obtenir la valeur de la prop disabled
    const isInWatchlist = isInWatchlistArray[index];
    return (
      <div className="item-card" key={`${item.id}_${index}`}>
        <div className="card-carousel">
          <div className="image-container">
            <LazyImage src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={item.title} />
            {isInWatchlist && <AccessTimeFilledIcon className="checkmark" />}
          </div>
          <div className="card-bottom">
            <div className="card-title">{item.title ?? item.name}</div>
          </div>
        </div>
        <HoverCard item={item} index={index} isInWatchlist={isInWatchlist} setIsInWatchlistArray={setIsInWatchlistArray} mediaType={mediaType} updateNote={updateNote} />
      </div>
    );
  });

  return (
    <div>
      <div className="discover-container">
        <Carousel infinite={true} responsive={responsive}>
          {itemsCarousel}
        </Carousel>
      </div>
    </div>
  );
};

export default Discover;
