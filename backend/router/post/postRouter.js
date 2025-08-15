import express from "express";
import expressAsyncHandler from "express-async-handler";
import Post from "../../models/Post/Post.model.js";
import postController from "../../controllers/post/postController.js";
import multer from "multer";
import storage from "../../utils/fileUpload.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import optionalAuth from "../../middlewares/optionalAuth.js";
import isAccountVerified from "../../middlewares/isAccountVerified.js";
import isBlocked from "../../middlewares/isBlocked.js";

//* Multer configuration for file uploads
const upload = multer({ storage });

//* Instance of express router
const postRouter = express.Router();

//* Create Post
postRouter.post(
  "/create",
  isAuthenticated,
  isAccountVerified,
  isBlocked,
  upload.single("image"),
  postController.createPost
);

//* List All Posts
postRouter.get("/", postController.listAllPosts);

//* Update Post
postRouter.put(
  "/:postId",
  isAuthenticated,
  isBlocked,
  upload.single("image"),
  postController.updatePost
);

//* Get Post
postRouter.get("/:postId", optionalAuth, isBlocked, postController.getPost);

//* Delete Post
postRouter.delete(
  "/:postId",
  isAuthenticated,
  isBlocked,
  postController.deletePost
);

//* Like Post
postRouter.put(
  "/likes/:postId",
  isAuthenticated,
  isBlocked,
  postController.likePost
);

//* Dislike Post
postRouter.put(
  "/dislikes/:postId",
  isAuthenticated,
  isBlocked,
  postController.dislikePost
);

export default postRouter;
