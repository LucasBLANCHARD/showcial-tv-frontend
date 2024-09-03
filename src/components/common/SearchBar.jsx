import React, { useState, useCallback, useEffect } from 'react';
import _ from 'lodash';
import IconSearch from '../../assets/icons/Search';
import './SearchBar.scss';

const SearchBar = ({ placeholder, onSearchChange, searchFunction }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction de recherche déboguée
  const debouncedSearch = useCallback(
    _.debounce((query) => {
      if (query.length > 0) {
        onSearchChange(query);
      } else {
        onSearchChange('');
      }
    }, 500),
    [onSearchChange]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);

    // Annuler la recherche déboguée si le composant est démonté
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  return (
    <form className="search-container" onSubmit={(e) => e.preventDefault()}>
      <div className="input-with-icon">
        <IconSearch className="search-icon" />
        <input type="text" className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={placeholder} />
      </div>
    </form>
  );
};

export default SearchBar;
