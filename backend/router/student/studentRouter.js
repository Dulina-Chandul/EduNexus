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

export default studentRouter;
