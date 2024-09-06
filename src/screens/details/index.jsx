import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addItemToList, getItemInWatchList, getLists, getTmdbItem, removeItemFromList } from '../../api';
import './index.scss';
import LazyImage from '../../components/common/LazyImage';
import Spinner from '../../components/common/Loader';
import StyledComponents from '../../assets/inputs';
import AddListModal from '../../components/add_list_modal';
import { jwtDecode } from 'jwt-decode';
import { Button } from '@mui/material';
import { t } from 'i18next';
import ErrorPage from '../error/index';
import { toast } from 'react-toastify';

const ItemDetails = () => {
  const { tmdbId, mediaType } = useParams();
  const [media, setMedia] = useState(null); // Utilisation d'une seule state pour film ou série
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemModal, setItemModal] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const token = localStorage.getItem('token');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [error, setError] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await getTmdbItem(tmdbId, mediaType);
        setMedia(response.data);
      } catch (err) {
        if (err.response) {
          setError(err.response.status);
        }
      }
    };

    fetchItem();
  }, [tmdbId, mediaType]);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (media && media.id && token) {
        try {
          const decodedToken = jwtDecode(token);
          const isInWatchlist = await getItemInWatchList(decodedToken.userId, media.id);
          // Mettez à jour l'état avec l'information si l'élément est dans la watchlist
          isInWatchlist.data ? setIsInWatchlist(true) : setIsInWatchlist(false);
        } catch (error) {
          console.error('Erreur lors de la vérification de la watchlist', error);
        } finally {
          setIsLoading(false); // Arrêter le chargement
        }
      }
    };

    checkWatchlist();
  }, [media, token]);

  const toggleModal = (item) => {
    setIsModalOpen(!isModalOpen);
    if (token) {
      const decodedToken = jwtDecode(token);
      setDecodedToken(decodedToken);
    }
    setItemModal(item);
  };

  const handleRemoveFromList = async (item) => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const listsResponse = await getLists(decodedToken.userId);
      if (listsResponse) {
        const watchlistId = listsResponse.data[0].find((list) => list.isDefault === true).id;
        const response = await removeItemFromList(token, watchlistId, item.id);
        if (response.status === 200) {
          // Mettre à jour l'état si l'élément est maintenant retiré de la watchlist
          setIsInWatchlist(false);
          toast.success(t('list.remove-from-watchlist'));
        } else {
          toast.error(t('list.error-removing-from-watchlist'));
        }
      }
    }
  };

  const handleAddList = async (item) => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const listsResponse = await getLists(decodedToken.userId);
      if (listsResponse) {
        const watchlistId = listsResponse.data[0].find((list) => list.isDefault === true).id;
        const response = await addItemToList(token, watchlistId, item.id, mediaType);

        if (response.status === 200) {
          // Mettre à jour l'état si l'élément est maintenant dans la watchlist
          setIsInWatchlist(true);
          toast.success(t('list.added-to-watchlist'));
        } else {
          toast.error(t('list.error-adding-to-watchlist'));
        }
      }
    }
  };

  if (error) {
    switch (error) {
      case 404:
        return <ErrorPage error={404} />;
      case 500:
        return <ErrorPage error={500} />;
      default:
        return <ErrorPage />;
    }
  }

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="item-detail">
          {isModalOpen && <AddListModal isOpen={isModalOpen} onClose={toggleModal} item={itemModal} decodedToken={decodedToken} mediaType={mediaType} onRatingUpdate={null} />}
          <div
            className="backdrop"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${media.backdrop_path})`
            }}
          >
            <div className="overlay">
              <div className="details-buttons">
                <StyledComponents.CssButtonContained onClick={() => window.history.back()}> {t('commun.back')} </StyledComponents.CssButtonContained>
                <div className="flex-sb gap">
                  {isInWatchlist ? (
                    <Button variant="outlined" className="primary-outlined-button" onClick={() => handleRemoveFromList(media)}>
                      {t('card.remove-from-watchlist')}
                    </Button>
                  ) : (
                    <Button variant="outlined" className="primary-outlined-button" onClick={() => handleAddList(media)}>
                      {t('card.add-to-watchlist')}
                    </Button>
                  )}
                  <Button variant="outlined" className="primary-outlined-button" onClick={() => toggleModal(media)}>
                    {t('card.add-to-list')}
                  </Button>
                </div>
              </div>
              <div className="poster-container">{media.poster_path ? <LazyImage className="poster" src={`https://image.tmdb.org/t/p/w500${media.poster_path}`} alt={media.title || media.name} /> : null}</div>

              <div className="details-container">
                <h1 className="title">{media.title || media.name}</h1>
                <p className="tagline">{media.tagline}</p>
                <p className="overview">{media.overview}</p>

                <div className="info-grid">
                  {mediaType === 'movie' && (
                    <>
                      <div>
                        <strong>{t('details.realease-date')}:</strong> {media.release_date}
                      </div>
                      <div>
                        <strong>{t('details.duration')}:</strong> {media.runtime} {t('details.minutes')}
                      </div>
                      <div>
                        <strong>{t('details.budget')}:</strong> ${media.budget.toLocaleString()}
                      </div>
                      <div>
                        <strong>{t('details.income')}:</strong> ${media.revenue.toLocaleString()}
                      </div>
                    </>
                  )}
                  {mediaType === 'tv' && (
                    <>
                      <div>
                        <strong>{t('details.first-air-date')}:</strong> {media.first_air_date}
                      </div>
                      <div>
                        <strong>{t('details.last-air-date')}:</strong> {media.last_air_date}
                      </div>
                      <div>
                        <strong>{t('details.number-of-seasons')}:</strong> {media.number_of_seasons}
                      </div>
                      <div>
                        <strong>{t('details.number-of-episodes')}</strong> {media.number_of_episodes}
                      </div>
                      <div>
                        <strong>{t('details.time-by-episode')}:</strong> {media.episode_run_time[0]} min
                      </div>
                      {media.in_production && media.next_episode_to_air && (
                        <div>
                          <strong>{t('details.next-episode')}:</strong> {media.next_episode_to_air.name}
                        </div>
                      )}
                    </>
                  )}
                  <div>
                    <strong>{t('details.genres')}:</strong> {media.genres.map((genre) => genre.name).join(', ')}
                  </div>
                  <div>
                    <strong>{t('details.country')}:</strong> {media.origin_country.join(', ')}
                  </div>
                  <div>
                    <strong>{t('details.languages')}:</strong> {media.original_language.toUpperCase()}
                  </div>
                  <div>
                    <strong>{t('list.rate')}:</strong> {media.vote_average} {t('details.on-ten')} ({media.vote_count} {t('details.votes')})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
