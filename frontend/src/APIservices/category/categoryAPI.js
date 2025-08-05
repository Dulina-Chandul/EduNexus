import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/categories";

//* Create Post API
export const createCategoryAPI = async (categoryData) => {
  console.log(categoryData);
  const response = await axios.post(`${BASE_URL}/create`, categoryData, {
    withCredentials: true,
  });
  return response.data;
};

//* Get All Category API
export const getAllCategoriesAPI = async () => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};
