import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { addFollow, deleteList, getConnectedUserProfile, getUserProfile, removeFollow } from '../../api/index.js';
import Spinner from '../../components/common/Loader';
import './index.scss';
import LazyImage from '../../components/common/LazyImage.jsx';
import StyledComponents from '../../assets/inputs/index';
import NewListModal from '../../components/common/NewListModal.jsx';
import { jwtDecode } from 'jwt-decode';
import { generateSlug } from '../../utils/slug.jsx';
import { t } from 'i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { userId } = useParams('userId');
  const [profile, setProfile] = useState(null); // État pour stocker les données de profil
  const [listsWithoutWatchlist, setListsWithoutWatchlist] = useState([]); // État pour stocker les listes de l'utilisateur
  const [watchlist, setWatchlist] = useState([]); // État pour stocker la watchlist de l'utilisateur
  const [isOpenListModal, setIsOpenListModal] = useState(false);
  const token = localStorage.getItem('token');
  const [decodedToken, setDecodedToken] = useState(null);
  const [isConnectedUser, setIsConnectedUser] = useState(false);
  const location = useLocation(); // Récupère l'URL actuelle
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingListData, setExistingListData] = useState(null);
  const [isFollowedUserConnected, setIsFollowedUserConnected] = useState(null);
  const [isFollowingUserConnected, setIsFollowingUserConnected] = useState(null);
  const navigate = useNavigate();

  const isOnListDetailsPage = location.pathname.includes('/list/');
  const isOnFollowsPage = location.pathname.includes('/followers') || location.pathname.includes('/followings');
  const shouldHideProfileContent = isOnListDetailsPage || isOnFollowsPage;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) {
          const userProfile = await getConnectedUserProfile(token);
          setProfile(userProfile.data.user);
          setListsWithoutWatchlist(userProfile.data.lists.filter((list) => list.isDefault === false));
          setWatchlist(userProfile.data.lists.find((list) => list.isDefault === true));
          setIsConnectedUser(true);
        } else {
          const followingProfile = await getUserProfile(token, userId);
          setProfile(followingProfile.data.user);
          setIsFollowedUserConnected(followingProfile.data.isFollowingUserConnected);
          setIsFollowingUserConnected(followingProfile.data.isFollowedUserConnected);
          setListsWithoutWatchlist(followingProfile.data.lists.filter((list) => list.isDefault === false));
          setWatchlist(followingProfile.data.lists.find((list) => list.isDefault === true));
          setIsConnectedUser(false);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };

    fetchProfile();
  }, [userId, token]); // Ajout de userId et token comme dépendances

  const createNewList = (action) => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setDecodedToken(decodedToken);
    }
    if (action === 'modify') {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }

    setIsOpenListModal(true);
  };

  const closeNewListModal = () => {
    setIsOpenListModal(false);
  };

  const handleListCreated = () => {
    window.location.reload();
  };

  const redirectToList = (list) => {
    const slug = generateSlug(list.name);
    const currentPath = window.location.pathname;
    const newPath = `${currentPath}/list/${slug}/${list.id}`;
    navigate(newPath);
  };

  const handleDropdownToggle = (list) => {
    setSelectedList(list);
    setDropdownOpen(!dropdownOpen);
  };

  const handleMenuClick = async (action) => {
    if (action === 'delete') {
      const response = await deleteList(token, selectedList.id);
      if (response.status === 200) {
        toast.success(t('list.delete-success'));
        window.location.reload();
      } else {
        toast.error(t('list.delete-failure'));
      }
    } else if (action === 'modify') {
      setIsEditMode(true);
      setExistingListData(selectedList);
      createNewList(action);
    }

    setDropdownOpen(false);
  };

  const handlefollowers = () => {
    //get current path
    const currentPath = window.location.pathname;
    navigate(`${currentPath}/followers`);
  };

  const handlefollowings = () => {
    //get current path
    const currentPath = window.location.pathname;
    navigate(`${currentPath}/followings`);
  };

  // Fonction pour ajouter un ami
  const addFriend = async (followedId) => {
    try {
      const response = await addFollow(token, followedId);
      setIsFollowedUserConnected(true);
      //if the request is successful, show a success message
      if (response.status === 200) {
        toast.success(`${t('follow.friend-success')} ${profile.username} `);
      } else {
        toast.error(t('follow.friend-failure'));
      }
    } catch (error) {
      console.error(`Erreur lors de l'envoi de la demande d'ami`, error);
    }
  };

  // Fonction pour retirer un ami
  const removeFriend = async (followedId) => {
    try {
      const response = await removeFollow(token, followedId);
      setIsFollowedUserConnected(false);

      if (response.status === 200) {
        toast.success(`${t('follow.unfriend-success')} ${profile.username} `);
      } else {
        toast.error(t('follow.unfriend-failure'));
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'ami`, error);
    }
  };

  return (
    <div>
      {!profile ? (
        <Spinner />
      ) : (
        <div>
          {!shouldHideProfileContent && (
            <>
              <div className="profile-to">
                {/* Bouton de création de liste uniquement pour l'utilisateur connecté */}
                <div className="left-section">
                  {isConnectedUser ? (
                    <>
                      <StyledComponents.CssButtonContained type="button" onClick={createNewList}>
                        {t('list.create-list')}
                      </StyledComponents.CssButtonContained>
                      <NewListModal isOpenListModal={isOpenListModal} onClose={closeNewListModal} decodedToken={decodedToken} onListCreated={handleListCreated} isEditMode={isEditMode} existingListData={existingListData} />
                    </>
                  ) : (
                    <div className="flex gap">
                      {isFollowingUserConnected && (
                        <div className="profile-follow-you">
                          {/* Contenu spécifique si l'utilisateur suit le connectedUser */}
                          <p>{t('follow.follow-you')}</p>
                        </div>
                      )}
                      {isFollowedUserConnected ? (
                        <div>
                          {/* Contenu spécifique si l'utilisateur est suivi par le connectedUser */}
                          <button className="remove-friend-button" onClick={() => removeFriend(profile.id)}>
                            {t('activity.remove-friend')}
                          </button>
                        </div>
                      ) : (
                        <button className="add-friend-button" onClick={() => addFriend(profile.id)}>
                          {t('activity.add-friend')}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="center-section">{isConnectedUser ? `${t('profile.hello')} ${profile.username}` : `${t('profile.profile-of')} ${profile.username}`}</div>

                {/* Affichage du nombre d'abonnés et abonnements */}
                <div className="right-section">
                  <div className="profile-follows">
                    <div className="profile-followers" onClick={handlefollowers}>
                      {profile.followersCount} {t('profile.followers')}
                    </div>
                    <div className="verticale-span"></div>
                    <div className="profile-followings" onClick={handlefollowings}>
                      {profile.followingsCount} {t('profile.following')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails des watchlists */}
              {watchlist && watchlist.items.length > 0 && (
                <div className="watchlist-container">
                  <div onClick={() => redirectToList(watchlist)} className="watchlist-border">
                    <h2 className="profile-title">{watchlist.name} :</h2>
                    <ul className="image-profile-container">
                      {watchlist.items.map((item) => (
                        <li className="item-watchlist-container" key={item.id}>
                          <LazyImage src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`} alt={item.name} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Détails des autres listes */}
              <div className="lists-container">
                {listsWithoutWatchlist.map((list) => (
                  <div onClick={() => redirectToList(list)} className="list-border" key={list.id}>
                    <div className="profile-title profile-list-settings">
                      <h2 className="primary-color">{list.name} :</h2>
                      {isConnectedUser ? (
                        <StyledComponents.CssMoreVertIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownToggle(list);
                          }}
                        ></StyledComponents.CssMoreVertIcon>
                      ) : null}
                      {selectedList === list && (
                        <div className={`dropdown-menu ${dropdownOpen ? 'open' : 'closed'}`}>
                          <ul>
                            <li
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuClick('modify');
                              }}
                            >
                              {t('list.modify-list')}
                            </li>
                            <li
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuClick('delete');
                              }}
                            >
                              {t('list.delete-list')}
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    <ul className="image-profile-container">
                      {list.items.map((item) => (
                        <li className="item-container" key={item.id}>
                          <LazyImage src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`} alt={item.name} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Profile;
