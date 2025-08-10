import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/posts";

//* Create Post API
export const createPostAPI = async (postData) => {
  console.log(postData);
  const response = await axios.post(`${BASE_URL}/create`, postData, {
    withCredentials: true,
  });
  return response.data;
};

//* Get All Posts API
export const getAllPostsAPI = async (filters) => {
  console.log("Filters:", filters);
  const response = await axios.get(`${BASE_URL}`, { params: filters });
  return response.data;
};

//* Get Single Post API
export const getSinglePostAPI = async (postId) => {
  const response = await axios.get(`${BASE_URL}/${postId}`);
  return response.data;
};

//* Update Post API
export const updatePostAPI = async (postId, postData) => {
  const response = await axios.put(
    `${BASE_URL}/${postId}`,
    {
      title: postData.title,
      description: postData.description,
    },
    { withCredentials: true }
  );
  return response.data;
};

//* Delete Post API
export const deletePostAPI = async (postId) => {
  const response = await axios.delete(`${BASE_URL}/${postId}`, {
    withCredentials: true,
  });
  return response.data;
};
