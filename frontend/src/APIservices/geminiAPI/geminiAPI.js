import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/ai";

//* Fetch all Notifications API
export const getRandomQuoteAndTips = async () => {
  const response = await axios.get(`${BASE_URL}/get-dashboard-content`);
  console.log(response.data);
  return response.data;
};
