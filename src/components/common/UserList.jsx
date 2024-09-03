import React, { useState, useCallback } from 'react';
import './UserList.scss'; // Import du fichier SCSS si nécessaire
import { generateSlug } from '../../utils/slug';
import { t } from 'i18next';
import { addFollow, getConnectedUserFollowers, getConnectedUserFollowings, getUserFollowers, getUserFollowings, getUsersByUsername, removeFollow } from '../../api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserList = ({ usersFind, setUsersFind, token, query, limit, hasMore, setHasMore }) => {
  const [offset, setOffset] = useState(0);
  const { userId } = useParams('userId');
  const isFollowersPage = location.pathname.includes('followers');
  const isFollowingsPage = location.pathname.includes('followings');
  const navigate = useNavigate();

  const redirectTo = (user) => {
    const slug = generateSlug(user.username);
    navigate(`/profile/${slug}/${user.id}`);
  };

  // Fonction pour ajouter un ami
  const addFriend = async (followedId, index) => {
    try {
      const response = await addFollow(token, followedId);

      if (response.status === 200) {
        toast.success(`${t('follow.friend-success')} ${usersFind[index].username}`);

        // Créer une nouvelle liste d'utilisateurs pour forcer la mise à jour de l'état
        const updatedUsers = [...usersFind];
        updatedUsers[index] = {
          ...updatedUsers[index],
          isFollowing: true
        };

        // Mettre à jour l'état avec la nouvelle liste
        setUsersFind(updatedUsers);
      } else {
        toast.error(t('follow.friend-error'));
      }
    } catch (error) {
      console.error(`Erreur lors de l'envoi de la demande d'ami`, error);
    }
  };

  // Fonction pour retirer un ami
  const removeFriend = async (followedId, index) => {
    try {
      const response = await removeFollow(token, followedId);
      if (response.status === 200) {
        toast.success(`${t('follow.unfriend-success')} ${usersFind[index].username}`);
        // Créer une nouvelle liste d'utilisateurs pour forcer la mise à jour de l'état
        const updatedUsers = [...usersFind];
        updatedUsers[index] = {
          ...updatedUsers[index],
          isFollowing: false
        };

        // Mettre à jour l'état avec la nouvelle liste
        setUsersFind(updatedUsers);
      } else {
        toast.error(t('follow.unfriend-failure'));
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'ami`, error);
    }
  };

  // Fonction pour charger plus d'utilisateurs
  const loadMoreUsers = useCallback(async () => {
    try {
      if (isFollowersPage || isFollowingsPage) {
        const fetchedUsers = userId ? (isFollowersPage ? await getUserFollowers(userId, limit, offset + limit) : await getUserFollowings(userId, limit, offset + limit)) : isFollowersPage ? await getConnectedUserFollowers(token, limit, offset + limit) : await getConnectedUserFollowings(token, limit, offset + limit);

        const moreUsers = fetchedUsers;
        setUsersFind((prevUsers) => [...prevUsers, ...moreUsers]);
        setOffset((prevOffset) => prevOffset + limit);
        setHasMore(moreUsers.length === limit);
      } else {
        const response = await getUsersByUsername(token, query, limit, offset + limit);
        const moreUsers = response.data.users;
        setUsersFind((prevUsers) => [...prevUsers, ...moreUsers]);
        setOffset((prevOffset) => prevOffset + limit);
        setHasMore(moreUsers.length === limit);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs supplémentaires:', error);
    }
  }, [token, query, limit, offset]);

  const renderButtons = (user, index) => {
    if (isFollowingsPage || isFollowersPage) {
      return (
        <>
          {!userId ? (
            <div className="follow-buttons-container">
              {user.isFollowed ? <p>{t('follow.follow-you')}</p> : null}
              {!user.isFollowing ? (
                <button className="add-friend-button" onClick={() => addFriend(user.id, index)}>
                  {t('activity.add-friend')}
                </button>
              ) : (
                <button className="remove-friend-button" onClick={() => removeFriend(user.id, index)}>
                  {t('activity.remove-friend')}
                </button>
              )}
            </div>
          ) : null}
        </>
      );
    } else {
      return (
        <>
          {user.you ? (
            <div className="user-search-you">{t('activity.you')}</div> // Afficher "Vous" si c'est l'utilisateur connecté
          ) : !user.isFollowing ? (
            <button className="add-friend-button" onClick={() => addFriend(user.id, index)}>
              {t('activity.add-friend')}
            </button>
          ) : (
            <button className="remove-friend-button" onClick={() => removeFriend(user.id, index)}>
              {t('activity.remove-friend')}
            </button>
          )}
        </>
      );
    }
  };

  return (
    <div className="user-list-container">
      {usersFind.length > 0 ? (
        <>
          {usersFind.map((user, index) => (
            <div className="user-card" key={user.id}>
              <div className="user-info" onClick={() => redirectTo(user)}>
                <div className="user-details">
                  <h3 className="user-username">{user.username}</h3>
                </div>
              </div>
              {renderButtons(user, index)}
            </div>
          ))}
          {hasMore && (
            <a className="load-more" onClick={loadMoreUsers}>
              {t('search.load-more')}
            </a>
          )}
        </>
      ) : (
        <p className="activity-no-found">{t('activity.no-user-find')}.</p>
      )}
    </div>
  );
};

export default UserList;
