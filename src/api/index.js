import axios from 'axios';

const API_URL = 'http://localhost:8000';

//login
export const loginUser = async (email, password, rememberMe) => {
  return await axios.post(`${API_URL}/auth/login`, { email, password, rememberMe });
};

//signup
export const signupUser = async (email, username, password, currentLangage) => {
  return await axios.post(`${API_URL}/auth/signup?lng=${currentLangage}`, {
    email,
    username,
    password
  });
};

//change password
export const changePassword = async (token, currentPassword, newPassword) => {
  return await axios.post(
    `${API_URL}/auth/change-password`,
    { currentPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

// search media
export const research = async (mediaType, query, page) => {
  return await axios.get(`${API_URL}/media/${mediaType}/research`, {
    params: { query, page }
  });
};

// get profile data
export const getConnectedUserProfile = async (token) => {
  return await axios.get(`${API_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// get profile data by username
export const getUserProfile = async (token, userId) => {
  return await axios.get(`${API_URL}/user/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

//add item to list
export const addItemToList = async (token, listId, tmdbId, media_type) => {
  return await axios.post(
    `${API_URL}/list/addItemToList`,
    { listId, tmdbId, media_type },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

//get all lists from a user
export const getLists = async (userId) => {
  return await axios.get(`${API_URL}/list/getLists/${userId}`);
};

//get item in watchlist
export const getItemInWatchList = async (userId, tmdbId) => {
  return await axios.get(`${API_URL}/list/getItemInWatchList/${userId}`, { params: { tmdbId } });
};

//remove item from list
export const removeItemFromList = async (token, listId, tmdbId) => {
  return await axios.delete(`${API_URL}/list/removeItemFromList`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: { listId, tmdbId }
  });
};

//check if item is in lists
export const checkIfIsInLists = async (userId, tmdbId) => {
  return await axios.get(`${API_URL}/list/checkIfIsInLists/${userId}`, { params: { tmdbId } });
};

//get comment
export const getItemComment = async (userId, tmdbId) => {
  return await axios.get(`${API_URL}/list/getItemComment/${userId}`, { params: { tmdbId } });
};

//add comment
export const addComment = async (userId, tmdbId, comment, note, isMovie) => {
  return await axios.post(`${API_URL}/list/addComment/${userId}`, { tmdbId, comment, note, isMovie });
};

//create new list
export const createList = async (userId, listName, listDescription, listId?) => {
  return await axios.post(`${API_URL}/list/createList`, { userId, name: listName, description: listDescription, listId });
};

//discover movies of the week
export const moviesOrSeriesOfWeek = async (mediaType) => {
  return await axios.get(`${API_URL}/media/${mediaType}/movies-of-week`);
};

//discover popular movies or series
export const popular = async (mediaType) => {
  return await axios.get(`${API_URL}/media/${mediaType}/popular`);
};

//discover popular movies or series animation
export const popularAnimation = async (mediaType) => {
  return await axios.get(`${API_URL}/media/${mediaType}/popular-animation`);
};

//add follow
export const addFollow = async (token, userFollowingId) => {
  return await axios.post(
    `${API_URL}/activities/follow`,
    { userFollowingId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

//remove follow
export const removeFollow = async (token, userFollowingId) => {
  return await axios.delete(`${API_URL}/activities/unfollow`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: { userFollowingId } // `data` is used to pass body data with DELETE
  });
};

//get users by username
export const getUsersByUsername = async (token, username, limit, offset) => {
  return await axios.get(`${API_URL}/user/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      limit,
      offset
    }
  });
};

//get activities
export const getActivities = async (token, limit, page) => {
  return await axios.get(`${API_URL}/activities`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { limit, page }
  });
};

//get list by id
export const getListById = async (id) => {
  return await axios.get(`${API_URL}/list/getListById/${id}`);
};

//get list and items by id
export const getListAndItemsById = async (id, limit, offset) => {
  return await axios.get(`${API_URL}/list/getListAndItemsById/${id}`, { params: { limit, offset } });
};

//get comment by id
export const getCommentById = async (id) => {
  return await axios.get(`${API_URL}/list/getCommentById/${id}`);
};

//get item by id
export const getItemById = async (token, id) => {
  return await axios.get(`${API_URL}/list/getItemById/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

//get items by id
export const getItemsById = async (token, ids, userId) => {
  const response = await axios.get(`${API_URL}/list/getItemsById`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { ids, userId }
  });
  return response.data;
};

//get details item with tmdb
export const getTmdbItem = async (tmdbId, mediaType) => {
  return await axios.get(`${API_URL}/media/${mediaType}/${tmdbId}`);
};

//delete comment
export const deleteComment = async (commentId) => {
  return await axios.post(`${API_URL}/list/deleteComment/${commentId}`);
};

//delete list
export const deleteList = async (token, listId) => {
  return await axios.delete(`${API_URL}/list/deleteList/${listId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

//get connected user followers
export const getConnectedUserFollowers = async (token, limit, offset) => {
  const response = await axios.get(`${API_URL}/user/profile/followers`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { limit, offset }
  });
  return response.data;
};

//get connected user followings
export const getConnectedUserFollowings = async (token, limit, offset) => {
  const response = await axios.get(`${API_URL}/user/profile/followings`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { limit, offset }
  });
  return response.data;
};

//get user followers
export const getUserFollowers = async (userId, limit, offset) => {
  const response = await axios.get(`${API_URL}/user/profile/${userId}/followers`, { params: { limit, offset } });
  return response.data;
};

//get user followings
export const getUserFollowings = async (userId, limit, offset) => {
  const response = await axios.get(`${API_URL}/user/profile/${userId}/followings`, { params: { limit, offset } });
  return response.data;
};

//delete account
export const deleteAccount = async (token) => {
  return await axios.delete(`${API_URL}/user/delete-account`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
