import express from "express";
import userController from "../../controllers/users/userController.js";

//* Instance of express router
const userRouter = express.Router();

//* Create User
userRouter.post("/register", userController.register);

//* Login
userRouter.post("/login", userController.login);

//* Google OAuth
userRouter.get("/auth/google", userController.googleAuth);

//* Google OAuth Callback
userRouter.get("/auth/google/callback", userController.googleAuthCallback);

//* Check if user is authenticated
userRouter.get("/auth/check", userController.checkAuthenticated);

//* Logout
userRouter.post("/logout", userController.logout);

export default userRouter;
