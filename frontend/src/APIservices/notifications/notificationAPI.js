import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/notifications";

//* Fetch all Notifications API
export const fetchNotificationsAPI = async () => {
  const response = await axios.get(`${BASE_URL}`);
  console.log(response.data);
  return response.data;
};

//* Read notifications
export const ReadNotificationsAPI = async (notificationId) => {
  const response = await axios.put(`${BASE_URL}/${notificationId}`, {});
  return response.data;
};
