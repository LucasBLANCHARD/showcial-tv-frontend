import React, { useCallback, useEffect, useState } from 'react';
import { getCommentById, getItemById, getListById, getActivities, getUsersByUsername } from '../../api';
import './index.scss';
import LazyImage from '../../components/common/LazyImage';
import { formatActivityDate } from '../../utils/date';
import SearchBar from '../../components/common/SearchBar';
import { generateSlug } from '../../utils/slug';
import { t } from 'i18next';
import UserList from '../../components/common/UserList';
import { useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

const Activities = () => {
  const token = localStorage.getItem('token');
  const language = localStorage.getItem('i18nextLng');
  const [activities, setActivities] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [usersFind, setUsersFind] = useState([]);
  const [limitUsers] = useState(10);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [queryUsers, setQuery] = useState('');
  const navigate = useNavigate();

  // Pagination for activities
  const [page, setPage] = useState(0);
  const [limitActivities] = useState(20);
  const [hasMoreActivities, setHasMoreActivities] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
    }
    fetchActivities();
  }, []);

  const fetchActivities = async (page) => {
    try {
      const res = await getActivities(token, limitActivities, page);
      const activitiesData = res.data.activities[0];

      // Parcourir les activités et récupérer les détails en fonction du type d'activité
      const updatedActivities = await Promise.all(
        activitiesData.map(async (activity) => {
          switch (activity.type) {
            case 'COMMENT_CREATED':
            case 'COMMENT_UPDATE': {
              const commentDetails = await fetchCommentDetails(activity.referenceId);
              return { ...activity, commentDetails };
            }
            case 'ITEM_ADDED': {
              const itemDetails = await fetchItemDetails(activity.referenceId);
              return { ...activity, itemDetails };
            }
            default:
              return activity;
          }
        })
      );

      // Ajouter les nouvelles activités aux activités existantes
      setActivities((prevActivities) => [...prevActivities, ...updatedActivities]);

      // Vérifier s'il reste encore des activités à charger
      setHasMoreActivities(updatedActivities.length === limitActivities);
    } catch (error) {
      console.error('Erreur lors de la récupération des activités', error);
    }
  };

  const loadMoreActivities = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchActivities(nextPage);
  };

  const handleSearchChange = useCallback(
    async (newQuery) => {
      setIsSearching(newQuery.length > 0);
      setQuery(newQuery);

      if (newQuery.length > 0) {
        try {
          const response = await getUsersByUsername(token, newQuery, limitUsers, 0);
          const newUsers = response.users;

          setUsersFind(newUsers);
          setHasMoreUsers(newUsers.length === limitUsers);
        } catch (error) {
          console.error('Erreur lors de la recherche des utilisateurs:', error);
        }
      } else {
        setUsersFind([]); // Réinitialiser les résultats si la recherche est vide
      }
    },
    [token, limitUsers]
  );

  const fetchCommentDetails = async (commentId) => {
    try {
      const res = await getCommentById(commentId);

      return res.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du commentaire', error);
      return null;
    }
  };

  const fetchItemDetails = async (itemId) => {
    try {
      const res = await getItemById(token, itemId);
      return res.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails de l'item`, error);
      return null;
    }
  };

  const redirectTo = (activity, type) => () => {
    switch (type) {
      case 'details':
        if (activity.commentDetails && activity.commentDetails.isMovie) {
          navigate(`/${type}/movie/${generateSlug(activity.commentDetails.itemName)}/${activity.commentDetails.tmdbId}`);
        } else if (activity.commentDetails && !activity.commentDetails.isMovie) {
          navigate(`/${type}/tv/${generateSlug(activity.commentDetails.itemName)}/${activity.commentDetails.tmdbId}`);
        } else if (activity.itemDetails && activity.itemDetails.isMovie) {
          navigate(`/${type}/movie/${generateSlug(activity.itemDetails.name)}/${activity.itemDetails.tmdbId}`);
        } else if (activity.itemDetails && !activity.itemDetails.isMovie) {
          navigate(`/${type}/tv/${generateSlug(activity.itemDetails.name)}/${activity.itemDetails.tmdbId}`);
        }
        break;
      case 'list':
        navigate(`/profile/${generateSlug(activity.user.username)}/${activity.userId}/${type}/${activity.itemDetails.list.name}/${activity.itemDetails.listId}`);
        break;
      case 'profile':
        navigate(`/profile/${generateSlug(activity.user.username)}/${activity.userId}`);
        break;
      default:
        break;
    }
  };

  const renderActivityMessage = (activity) => {
    const dateActivity = formatActivityDate(activity.createdAt, language);
    switch (activity.type) {
      case 'COMMENT_UPDATE':
        return (
          <div className="activity-container">
            <LazyImage src={`https://image.tmdb.org/t/p/w185${activity.commentDetails.poster_path}`} alt={activity.commentDetails.itemName} />
            <div className="activity-content-container">
              <div className="activity-comment">
                <p>
                  <Trans i18nKey="activity.modified-comment-for-item">
                    <span className="cliquable-redirect" onClick={redirectTo(activity, 'profile')}>
                      {{ username: activity.user.username }}
                    </span>
                    {' modified their comment for '}
                    <span className="cliquable-redirect" onClick={redirectTo(activity, 'details')}>
                      {{ itemName: activity.commentDetails.itemName }}
                    </span>
                    {' :'}
                  </Trans>
                </p>
                {activity.commentDetails && (
                  <div>
                    <h3>{activity.commentDetails.content}</h3>
                  </div>
                )}
              </div>
              {activity.commentDetails && activity.commentDetails.rating && (
                <div className="activity-rating">
                  <h3>
                    {t('list.rate')}: {activity.commentDetails.rating} {t('list.on-twenty')}
                  </h3>
                </div>
              )}
            </div>
            <div className="activity-date">{dateActivity}</div>
          </div>
        );

      case 'COMMENT_CREATED':
        return (
          <div className="activity-container">
            <LazyImage src={`https://image.tmdb.org/t/p/w185${activity.commentDetails.poster_path}`} alt={activity.commentDetails.itemName} />
            <div className="activity-content-container">
              <div className="activity-comment">
                <p>
                  <Trans i18nKey="activity.added-comment-for-item">
                    <span className="cliquable-redirect" onClick={redirectTo(activity, 'profile')}>
                      {{ username: activity.user.username }}
                    </span>
                    {' added a new comment for '}
                    <span className="cliquable-redirect" onClick={redirectTo(activity, 'details')}>
                      {{ itemName: activity.commentDetails.itemName }}
                    </span>
                    {' :'}
                  </Trans>
                </p>
                {activity.commentDetails && (
                  <div>
                    <h3>{activity.commentDetails.content}</h3>
                  </div>
                )}
              </div>
              {activity.commentDetails && activity.commentDetails.rating && (
                <div className="activity-rating">
                  <h3>
                    {t('list.rate')}: {activity.commentDetails.rating} {t('list.on-twenty')}
                  </h3>
                </div>
              )}
            </div>
            <div className="activity-date">{dateActivity}</div>
          </div>
        );

      case 'ITEM_ADDED':
        return (
          <div className="activity-container">
            {activity.itemDetails.poster_path ? <LazyImage src={`https://image.tmdb.org/t/p/w185${activity.itemDetails.poster_path}`} alt={activity.itemDetails.name} /> : null}
            <div className="activity-content-container">
              <p>
                <Trans i18nKey="activity.added-item-to-list">
                  <span className="cliquable-redirect" onClick={redirectTo(activity, 'profile')}>
                    {{ username: activity.user.username }}
                  </span>
                  {' added '}
                  <span className="cliquable-redirect" onClick={redirectTo(activity, 'details')}>
                    {{ itemName: activity.itemDetails.name }}
                  </span>
                  {' to their list '}
                  <span className="cliquable-redirect" onClick={redirectTo(activity, 'list')}>
                    {{ listName: activity.itemDetails.list.name }}
                  </span>
                  {' .'}
                </Trans>
              </p>
            </div>
            <div className="activity-date">{dateActivity}</div>
          </div>
        );
      default:
        return `Activité inconnue.`;
    }
  };

  return (
    <>
      <div className="activity-header">
        {!isSearching ? <h1 className="h1-activities">{t('activity.activity-feed')}</h1> : <h1 className="h1-activities">{t('activity.search-results')}</h1>}
        <div className="activity-search">
          <SearchBar placeholder={t('activity.find-users')} onSearchChange={handleSearchChange} />
        </div>
      </div>
      {!isSearching && (
        <InfiniteScroll dataLength={activities.length} next={loadMoreActivities} hasMore={hasMoreActivities} initialScrollY={true} style={{ overflow: 'visible' }}>
          <div>
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <div className="activities-container">
                    <h2>{activity.title}</h2>
                    <div>{renderActivityMessage(activity)}</div>
                  </div>
                  {/* Ajout de la barre de séparation */}
                  {index < activities.length - 1 && <hr className="activity-separator" />}
                </React.Fragment>
              ))
            ) : (
              <p className="activity-no-found">{t('activity.no-activities')}.</p>
            )}
          </div>
        </InfiniteScroll>
      )}
      {
        // Si la recherche est en cours
        isSearching && (
          // Afficher les résultats de la recherche
          <UserList usersFind={usersFind} setUsersFind={setUsersFind} token={token} query={queryUsers} limit={limitUsers} hasMore={hasMoreUsers} setHasMore={setHasMoreUsers} />
        )
      }
    </>
  );
};

export default Activities;
