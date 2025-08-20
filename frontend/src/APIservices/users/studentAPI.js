import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/student";

//* Get the profile of the student
export const getStudentProfileAPI = async () => {
  const resposne = await axios.get(`${BASE_URL}/profile`, {
    withCredentials: true,
  });
  return resposne.data;
};

//* Update the student Profile
export const updateStudentProfileAPI = async (profileData) => {
  const response = await axios.put(`${BASE_URL}/profile/update`, profileData, {
    withCredentials: true,
  });
  return response.data;
};

//* Generate the daily planner
export const generateDailyPlannerAPI = async () => {
  const response = await axios.post(
    `${BASE_URL}/generate-planner`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};
