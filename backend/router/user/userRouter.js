import express from "express";
import userController from "../../controllers/users/userController.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import multer from "multer";
import storage from "../../utils/fileUpload.js";

//* Instance of express router
const userRouter = express.Router();

//* Multer configuration for file uploads
const upload = multer({ storage });

// * Fetch all users
userRouter.get("/all", isAuthenticated, userController.getAllUsers);

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

//* Verify user email
userRouter.put("/verify-email/", isAuthenticated, userController.verifyEmail);

//* Verify the user account
userRouter.put(
  "/verify-account/:token",
  isAuthenticated,
  userController.verifyAccount
);

//* Request password reset
userRouter.post("/forgot-password", userController.requestPasswordReset);

// * Reset password
userRouter.post("/reset-password/:verifyToken", userController.resetPassword);

//* Update user email
userRouter.put("/update-email", isAuthenticated, userController.updateEmail);

//* Update user profile picture
userRouter.put(
  "/upload-profile-picture",
  isAuthenticated,
  upload.single("image"),
  userController.updateProfilePicture
);

//* Block User
userRouter.put("/block-user/", isAuthenticated, userController.blockUser);

//* Unblock User
userRouter.put("/unblock-user/", isAuthenticated, userController.unblockUser);

export default userRouter;
