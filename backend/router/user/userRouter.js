import express from "express";
import userController from "../../controllers/users/userController.js";

//* Instance of express router
const userRouter = express.Router();

//* Create User
userRouter.post("/register", userController.register);

//* Login
userRouter.post("/login", userController.login);

export default userRouter;
