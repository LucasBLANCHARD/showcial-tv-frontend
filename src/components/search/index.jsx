import React, { useState, useEffect, useCallback } from 'react';
import './index.scss';
import _ from 'lodash';
import LazyImage from '../common/LazyImage';
import Spinner from '../common/Loader';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { getItemInWatchList } from '../../api';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import HoverCard from '../common/HoverCard';
import SearchBar from '../common/SearchBar';

const SearchComponent = ({ searchFunction, placeholder, onSearchChange, mediaType, isSearching }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInWatchlistArray, setIsInWatchlistArray] = useState([]);
  const token = localStorage.getItem('token');
  const [activeCardIndex, setActiveCardIndex] = useState(null); // Index de la carte active

  const debouncedSearch = useCallback(
    _.debounce(async (query) => {
      if (query.length > 0) {
        try {
          setPage(1);
          setHasMore(true);
          setLoading(true);
          const response = await searchFunction(query, 1); // Rechercher dès la première page
          setResults(response.data.results);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]); // Effacer les résultats si la recherche est vide
      }
    }, 500),
    [searchFunction]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    if (onSearchChange) {
      onSearchChange(searchTerm); // Informe le parent du changement dans la barre de recherche
    }
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch, onSearchChange]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    searchFunction(searchTerm, page + 1).then((response) => {
      const newResults = response.data.results;
      if (newResults.length > 0) {
        setResults((prevResults) => [...prevResults, ...newResults]);
      } else {
        setHasMore(false);
      }
    });
  };

  const isAlreadyInWatchlist = async (item) => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const isInWatchlist = await getItemInWatchList(decodedToken.userId, item);
      return isInWatchlist.data || false;
    }
    return false;
  };

  useEffect(() => {
    const fetchIsInWatchlist = async () => {
      const promises = results.map((item) => isAlreadyInWatchlist(item.id));
      const isInWatchlistResults = await Promise.all(promises);
      setIsInWatchlistArray(isInWatchlistResults);
    };
    fetchIsInWatchlist();
  }, [results]);

  const handleCardClick = (index) => {
    if (activeCardIndex === index) {
      // Si on clique sur la même carte, on la ferme
      setActiveCardIndex(null);
    } else {
      // Sinon, on active la carte cliquée
      setActiveCardIndex(index);
    }
  };

  return (
    <div className="research-container">
      <div className="discover-search">
        <SearchBar placeholder={placeholder} onSearchChange={setSearchTerm} />
      </div>
      <div className="card-container">
        {loading && (
          <div className="spinner-search">
            <Spinner />
          </div>
        )}
        {/* Si aucun résultat n'est trouvé, afficher un message */}
        {results.length === 0 && !loading && isSearching && <div className="activity-no-found">{t('search.no-found')}</div>}
        {results.map((item, index) => (
          <div key={`${item.id}_${index}`} className="card" onClick={() => handleCardClick(index)}>
            <div className="image-container">
              {item.poster_path ? <LazyImage src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title ?? item.name} /> : null}
              {isInWatchlistArray[index] && <AccessTimeFilledIcon className="checkmark" />}
            </div>
            <div className="card-bottom">
              <div className="card-title">{item.title ?? item.name}</div>
            </div>
            <HoverCard item={item} index={index} isInWatchlist={isInWatchlistArray[index]} setIsInWatchlistArray={setIsInWatchlistArray} mediaType={mediaType} isClicked={activeCardIndex === index} />
          </div>
        ))}
      </div>
      {results.length !== 0 && hasMore && (
        <a className="load-more" onClick={handleLoadMore}>
          {t('search.load-more')}
        </a>
      )}
      {!hasMore && <div className="load-more">{t('search.no-more')}</div>}
    </div>
  );
};

export default SearchComponent;
