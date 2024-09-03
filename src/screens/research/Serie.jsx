import React, { useState } from 'react';
import { research, moviesOrSeriesOfWeek, popular, popularAnimation } from '../../api/index.js';
import SearchComponent from '../../components/search/';
import { useTranslation } from 'react-i18next';
import Discover from '../../components/common/Discover';

const Serie = () => {
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const mediaType = 'tv';

  const searchSeries = (query, page) => {
    return research('tv', query, page);
  };

  const moviesOrSeriesOfTheWeek = () => {
    return moviesOrSeriesOfWeek('tv');
  };

  const popularMoviesAndSeries = () => {
    return popular('tv');
  };

  const popularMoviesAndSeriesAnimation = () => {
    return popularAnimation('tv');
  };

  const handleSearchChange = (query) => {
    setIsSearching(query.length > 0 ? true : false);
  };

  return (
    <div className="flex-column">
      <SearchComponent searchFunction={searchSeries} placeholder={t('search.serie')} mediaType={mediaType} onSearchChange={handleSearchChange} />
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
            <h2>{t('search.popular-series-animation')}</h2>
            <Discover content={popularMoviesAndSeriesAnimation} mediaType={mediaType} />
          </div>
        </>
      )}
    </div>
  );
};

export default Serie;
