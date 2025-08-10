import express from "express";
import userController from "../../controllers/users/userController.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

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

//* Get user profile
userRouter.get("/profile", isAuthenticated, userController.getUserProfile);

//* Follow a user
userRouter.put("/follow/:followId", isAuthenticated, userController.followUser);

//* Unfollow a user
userRouter.put(
  "/unfollow/:unfollowId",
  isAuthenticated,
  userController.unfollowUser
);

export default userRouter;
