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

//* Generate quiz questions
export const generateQuizAPI = async (quizData) => {
  const response = await axios.post(`${BASE_URL}/generate-quiz`, quizData, {
    withCredentials: true,
  });
  return response.data;
};

//* Submit quiz answers
export const submitQuizAnswerAPI = async (submissionData) => {
  const response = await axios.post(`${BASE_URL}/submit-quiz`, submissionData, {
    withCredentials: true,
  });
  return response.data;
};

//* Get quiz history
export const getQuizHistoryAPI = async () => {
  const response = await axios.get(`${BASE_URL}/quiz-history`, {
    withCredentials: true,
  });
  return response.data;
};

//* AI Chat assistance
export const aiChatAPI = async (chatData) => {
  const response = await axios.post(`${BASE_URL}/ai-chat`, chatData, {
    withCredentials: true,
  });
  return response.data;
};
