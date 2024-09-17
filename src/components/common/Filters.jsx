import React, { useState } from 'react';
import './Filters.scss'; // Tu peux styliser ce composant dans ce fichier
import StyledComponents from '../../assets/inputs';
import { Box, Checkbox, Chip, FormControlLabel, FormGroup, ListSubheader, MenuItem, ThemeProvider } from '@mui/material';
import { t } from 'i18next';

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    media: '',
    genre: [],
    year: '',
    rating: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Mettre à jour l'état local des filtres
    setFilters((prevFilters) => {
      let updatedFilters = { ...prevFilters, [name]: value };

      // Si 'media' est mis à jour à 'movie', filtrer les genres pour garder uniquement ceux de films
      if (name === 'media' && value === 'movie') {
        updatedFilters.genre = prevFilters.genre.filter((genre) => genres.find((g) => g.value === genre).type === 'film');
      }

      // Si 'media' est mis à jour à 'tv', filtrer les genres pour garder uniquement ceux de séries
      if (name === 'media' && value === 'tv') {
        updatedFilters.genre = prevFilters.genre.filter((genre) => genres.find((g) => g.value === genre).type === 'tv');
      }

      // Appeler onFilterChange avec les filtres mis à jour
      onFilterChange(updatedFilters);

      // Retourner les nouveaux filtres pour mettre à jour l'état
      return updatedFilters;
    });
  };

  const genres = [
    { label: t('filters.action-&-adventure'), value: '10759', type: 'tv' },
    { label: t('filters.animation'), value: '16', type: 'tv' },
    { label: t('filters.comedy'), value: '35', type: 'tv' },
    { label: t('filters.crime'), value: '80', type: 'tv' },
    { label: t('filters.documentary'), value: '99', type: 'tv' },
    { label: t('filters.drama'), value: '18', type: 'tv' },
    { label: t('filters.kids'), value: '10762', type: 'tv' },
    { label: t('filters.mystery'), value: '9648', type: 'tv' },
    { label: t('filters.news'), value: '10763', type: 'tv' },
    { label: t('filters.reality'), value: '10764', type: 'tv' },
    { label: t('filters.science-fiction-&-fantasy'), value: '10765', type: 'tv' },
    { label: t('filters.soap'), value: '10766', type: 'tv' },
    { label: t('filters.talk'), value: '10767', type: 'tv' },
    { label: t('filters.war-&-politics'), value: '10768', type: 'tv' },
    { label: t('filters.western'), value: '37', type: 'tv' },
    { label: t('filters.action'), value: '28', type: 'film' },
    { label: t('filters.adventure'), value: '12', type: 'film' },
    { label: t('filters.animation'), value: '16', type: 'film' },
    { label: t('filters.comedy'), value: '35', type: 'film' },
    { label: t('filters.crime'), value: '80', type: 'film' },
    { label: t('filters.documentary'), value: '99', type: 'film' },
    { label: t('filters.drama'), value: '18', type: 'film' },
    { label: t('filters.family'), value: '10751', type: 'film' },
    { label: t('filters.fantasy'), value: '14', type: 'film' },
    { label: t('filters.history'), value: '36', type: 'film' },
    { label: t('filters.horror'), value: '27', type: 'film' },
    { label: t('filters.music'), value: '10402', type: 'film' },
    { label: t('filters.mystery'), value: '9648', type: 'film' },
    { label: t('filters.romance'), value: '10749', type: 'film' },
    { label: t('filters.science-fiction'), value: '878', type: 'film' },
    { label: t('filters.tv-movie'), value: '10770', type: 'film' },
    { label: t('filters.thriller'), value: '53', type: 'film' },
    { label: t('filters.war'), value: '10752', type: 'film' },
    { label: t('filters.western'), value: '37', type: 'film' }
  ];

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    let newGenres = [...filters.genre];

    if (checked) {
      newGenres.push(value);
    } else {
      newGenres = newGenres.filter((genre) => genre !== value);
    }

    handleFilterChange({ target: { name: 'genre', value: newGenres } });
  };

  const handleRemoveGenre = (genreToRemove) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        genre: prevFilters.genre.filter((genre) => genre !== genreToRemove) // Retire le genre sélectionné
      };

      // Appeler onFilterChange avec les filtres mis à jour
      onFilterChange(updatedFilters);

      return updatedFilters;
    });
  };

  return (
    <div>
      <div className="filters">
        <ThemeProvider theme={StyledComponents.theme}>
          <StyledComponents.CssSelect
            name="media"
            value={filters.media}
            displayEmpty
            renderValue={(selected) => {
              if (selected === 'both') {
                return t('filters.movie-tv');
              }
              if (selected === 'movie') {
                return t('filters.movies');
              }
              if (selected === 'tv') {
                return t('filters.series');
              }
              return t('filters.movie-tv');
            }}
            onChange={handleFilterChange}
          >
            <MenuItem value="both">{t('filters.both')}</MenuItem>
            <MenuItem value="movie">{t('filters.movies')}</MenuItem>
            <MenuItem value="tv">{t('filters.series')}</MenuItem>
          </StyledComponents.CssSelect>
        </ThemeProvider>

        <ThemeProvider theme={StyledComponents.theme}>
          <StyledComponents.CssSelect
            name="genre"
            value={filters.genre}
            displayEmpty // Affiche un placeholder même si rien n'est sélectionné
            renderValue={() => 'Genres'} // Affiche simplement "Genres" dans le select
            multiple
          >
            {(filters.media === 'movie' || filters.media === 'both' || filters.media === '') && <ListSubheader>{t('filters.movies')}</ListSubheader>}
            {(filters.media === 'movie' || filters.media === 'both' || filters.media === '') && (
              <FormGroup>
                {genres
                  .filter((genre) => genre.type === 'film')
                  .map((genre) => (
                    <FormControlLabel key={genre.value} control={<Checkbox checked={filters.genre.includes(genre.value)} onChange={handleCheckboxChange} value={genre.value} />} label={genre.label} />
                  ))}
              </FormGroup>
            )}
            {(filters.media === 'tv' || filters.media === 'both' || filters.media === '') && <ListSubheader>{t('filters.series')}</ListSubheader>}
            {(filters.media === 'tv' || filters.media === 'both' || filters.media === '') && (
              <FormGroup>
                {genres
                  .filter((genre) => genre.type === 'tv')
                  .map((genre) => (
                    <FormControlLabel key={genre.value} control={<Checkbox checked={filters.genre.includes(genre.value)} onChange={handleCheckboxChange} value={genre.value} />} label={genre.label} />
                  ))}
              </FormGroup>
            )}
          </StyledComponents.CssSelect>
        </ThemeProvider>
        {/* Ajoute les autres genres */}
        <div className="rating-filter">
          <StyledComponents.CssTextField type="number" name="rating" placeholder={t('filters.rate-min')} value={filters.rating} onChange={handleFilterChange} />
        </div>
      </div>
      {/* Afficher les genres sélectionnés en dehors du select sous forme de tags */}
      <ThemeProvider theme={StyledComponents.theme}>
        <Box sx={{ m: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filters.genre.map((selectedGenre) => {
            const genre = genres.find((g) => g.value === selectedGenre);

            return (
              genre && (
                <Chip
                  key={selectedGenre}
                  label={genre.label}
                  onDelete={() => handleRemoveGenre(selectedGenre)} // Fonction pour retirer le genre
                  sx={{ margin: '5px' }}
                />
              )
            );
          })}
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default Filters;
