import axios from "axios";
import { BASE_URL } from "../../utils/baseEndPoint.js";

//* Register new user API service
export const registerAPI = async (userData) => {
  const response = await axios.post(
    `${BASE_URL}/users/register`,
    {
      username: userData?.username,
      email: userData?.email,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

//* Login user API service
export const loginAPI = async (userData) => {
  const response = await axios.post(
    `${BASE_URL}/users/login`,
    {
      username: userData?.username,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

//* Authenticate user API service
export const authenticateUserAPI = async () => {
  const response = await axios.get(`${BASE_URL}/users/auth/check`, {
    withCredentials: true,
  });

  return response.data;
};

//* User profile
export const userProfileAPI = async () => {
  const response = await axios.get(`${BASE_URL}/users/profile`, {
    withCredentials: true,
  });

  return response.data;
};

//* Logout user API service
export const logOutAPI = async () => {
  const response = await axios.post(
    `${BASE_URL}/users/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

//* Follow User
export const followUserAPI = async (userId) => {
  const response = await axios.put(
    `${BASE_URL}/users/follow/${userId}`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

//* Unfollow User
export const unfollowUserAPI = async (userId) => {
  const response = await axios.put(
    `${BASE_URL}/users/unfollow/${userId}`,
    {},
    { withCredentials: true }
  );
  console.log("Unfollow Response:", response.data);
  return response.data;
};
