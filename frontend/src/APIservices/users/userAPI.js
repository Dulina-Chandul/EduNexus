import axios from "axios";
import { BASE_URL } from "../../utils/baseEndPoint.js";

//* List all users API service
export const listAllUsersAPI = async () => {
  const response = await axios.get(`${BASE_URL}/users/all`, {
    withCredentials: true,
  });
  return response.data;
};

//* Register new user API service
export const registerAPI = async (userData) => {
  const response = await axios.post(
    `${BASE_URL}/users/register`,
    {
      username: userData?.username,
      email: userData?.email,
      password: userData?.password,
      role: userData?.role || "student", // Add role to the userdata when adding admins and teachers
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

//* Send email verification token
export const accountVerificationEmailAPI = async () => {
  const response = await axios.put(
    `${BASE_URL}/users/verify-email`,
    {},
    { withCredentials: true }
  );

  return response.data;
};

//* Verify user account
export const verifyUserAccountAPI = async (verifyToken) => {
  const response = await axios.put(
    `${BASE_URL}/users/verify-account/${verifyToken}`,
    {},
    { withCredentials: true }
  );

  return response.data;
};

//* Request password reset
export const forgotPasswordAPI = async (email) => {
  const response = await axios.post(
    `${BASE_URL}/users/forgot-password`,
    { email },
    { withCredentials: true }
  );

  return response.data;
};

//* Reset password
export const resetPasswordAPI = async (data) => {
  const response = await axios.post(
    `${BASE_URL}/users/reset-password/${data?.token}`,
    { newPassword: data?.password },
    { withCredentials: true }
  );

  return response.data;
};

//* Update user email API
export const updateEmailAPI = async (email) => {
  const response = await axios.put(
    `${BASE_URL}/users/update-email`,
    { email },
    { withCredentials: true }
  );

  return response.data;
};

//* Upload profile picture API
export const uplaodProfilePicAPI = async (formData) => {
  const response = await axios.put(
    `${BASE_URL}/users/upload-profile-picture`,
    formData,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

//* Toglle user block status
export const toggleUserBlockStatusAPI = async (data) => {
  const response = await axios.put(
    data.actionURL,
    { userId: data?.userId },
    { withCredentials: true }
  );
  return response.data;
};
