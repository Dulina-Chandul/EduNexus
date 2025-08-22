import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import studentController from "../../controllers/users/student/studentController.js";

//* Instance of express router
const studentRouter = express.Router();

//* Get the user profile
studentRouter.get(
  "/profile",
  isAuthenticated,
  studentController.getStudentProfile
);

//* Updating the student profile
studentRouter.put(
  "/profile/update",
  isAuthenticated,
  studentController.updateStudentProfile
);

//* Generating the daily planner
studentRouter.post(
  "/generate-planner",
  isAuthenticated,
  studentController.generateDailyPlanner
);

//* Generate quiz questions
studentRouter.post(
  "/generate-quiz",
  isAuthenticated,
  studentController.generateQuiz
);

//* Submit quiz answers
studentRouter.post(
  "/submit-quiz",
  isAuthenticated,
  studentController.submitQuiz
);

//* Get quiz history
studentRouter.get(
  "/quiz-history",
  isAuthenticated,
  studentController.getQuizHistory
);

export default studentRouter;
