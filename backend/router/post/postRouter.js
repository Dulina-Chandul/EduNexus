import express from "express";
import expressAsyncHandler from "express-async-handler";
import Post from "../../models/Post/Post.model.js";
import postController from "../../controllers/post/postController.js";

//* Instance of express router
const postRouter = express.Router();

//* Create Post
postRouter.post("/posts/create", postController.createPost);

//* List All Posts
postRouter.get("/posts", postController.listAllPosts);

//* Update Post
postRouter.put("/posts/:postId", postController.updatePost);

//* Get Post
postRouter.get("/posts/:postId", postController.getPost);

//* Delete Post
postRouter.delete("/posts/:postId", postController.deletePost);

export default postRouter;
