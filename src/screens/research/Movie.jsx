import { React, useState } from 'react';
import { research, moviesOrSeriesOfWeek, popular, popularAnimation } from '../../api/index.js';
import SearchComponent from '../../components/search/';
import Discover from '../../components/common/Discover';
import { useTranslation } from 'react-i18next';

const Movie = () => {
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const mediaType = 'movie';

  const searchMovies = (query, page) => {
    return research('movie', query, page);
  };

  const moviesOrSeriesOfTheWeek = () => {
    return moviesOrSeriesOfWeek('movie');
  };

  const popularMoviesAndSeries = () => {
    return popular('movie');
  };

  const popularMoviesAndSeriesAnimation = () => {
    return popularAnimation('movie');
  };

  const handleSearchChange = (query) => {
    setIsSearching(query.length > 0 ? true : false);
  };

  return (
    <div className="flex-column">
      <SearchComponent searchFunction={searchMovies} placeholder={t('search.movie')} onSearchChange={handleSearchChange} mediaType={mediaType} isSearching={isSearching} />
      {!isSearching && (
        <>
          <div>
            <h2>{t('search.outings-of-week')}</h2>
            <Discover content={moviesOrSeriesOfTheWeek} mediaType={mediaType} />
          </div>
          <div>
            <h2>{t('search.popular')}</h2>
            <Discover content={popularMoviesAndSeries} mediaType={mediaType} />
          </div>
          <div>
            <h2>{t('search.popular-movies-animation')}</h2>
            <Discover content={popularMoviesAndSeriesAnimation} mediaType={mediaType} />
          </div>
        </>
      )}
    </div>
  );
};

export default Movie;
