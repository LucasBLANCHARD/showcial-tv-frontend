import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './index.scss';
import { getConnectedUserFollowers, getConnectedUserFollowings, getUserFollowers, getUserFollowings } from '../../api';
import { t } from 'i18next';
import UserList from '../../components/common/UserList';

const Follows = () => {
  const location = useLocation();
  const { userId } = useParams('userId');
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const token = localStorage.getItem('token');
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = async () => {
    try {
      const isFollowersPage = location.pathname.includes('followers');
      setTitle(isFollowersPage ? t('follow.followers') : t('follow.followings'));

      const fetchedUsers = userId ? (isFollowersPage ? await getUserFollowers(userId, limit + 1, 0) : await getUserFollowings(userId, limit + 1, 0)) : isFollowersPage ? await getConnectedUserFollowers(token, limit + 1, 0) : await getConnectedUserFollowings(token, limit + 1, 0);

      const hasMoreUsers = fetchedUsers.length > limit;
      setHasMore(hasMoreUsers);

      if (hasMoreUsers) {
        fetchedUsers.pop();
      }
      setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  useEffect(() => {
    setUsers([]); // Réinitialiser la liste des utilisateurs lors d'un changement de page
    setHasMore(true); // Réinitialiser hasMore
    fetchUsers(); // Charger les utilisateurs
  }, [location.pathname]); // Dépendre seulement du changement de page

  return (
    <div>
      <h1 className="follow-title">{title}</h1>
      <UserList usersFind={users} setUsersFind={setUsers} token={token} query={null} limit={limit} hasMore={hasMore} setHasMore={setHasMore} />
    </div>
  );
};

export default Follows;
