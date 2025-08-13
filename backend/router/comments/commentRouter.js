import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import commentsController from "../../controllers/comments/commentsController.js";

//* Instance of express router
const commentRouter = express.Router();

//* Create Comment
commentRouter.post(
  "/create",
  isAuthenticated,
  commentsController.createComment
);

export default commentRouter;
