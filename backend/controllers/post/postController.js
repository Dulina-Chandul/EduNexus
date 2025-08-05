import expressAsyncHandler from "express-async-handler";
import Post from "../../models/Post/Post.model.js";

const postController = {
  //* Create Post
  createPost: expressAsyncHandler(async (req, res) => {
    console.log(req.file);

    // Get the post data from the request body
    const { description } = req.body;

    const postCreated = await Post.create({
      description,
      image: req.file,
      author: req.user,
    });

    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      post: postCreated,
    });
  }),

  //* List All Posts
  listAllPosts: expressAsyncHandler(async (req, res) => {
    const posts = await Post.find();
    res.status(200).json({
      status: "success",
      message: "Posts retrieved successfully",
      posts: posts,
    });
  }),

  //* Update Post
  updatePost: expressAsyncHandler(async (req, res) => {
    const { postId } = req.params;
    const postFound = await Post.findById(postId);
    if (!postFound) {
      throw new Error("Post not found");
    }

    const postUpdated = await Post.findByIdAndUpdate(
      postId,
      { title: req.body.title, description: req.body.description },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Post updated successfully",
      post: postUpdated,
    });
  }),

  //* Get Post
  getPost: expressAsyncHandler(async (req, res) => {
    const { postId } = req.params;
    const postFound = await Post.findById(postId);
    if (!postFound) {
      throw new Error("Post not found");
    }
    res.status(200).json({
      status: "success",
      message: "Post retrieved successfully",
      post: postFound,
    });
  }),

  //* Delete Post
  deletePost: expressAsyncHandler(async (req, res) => {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      status: "success",
      message: "Post deleted successfully",
    });
  }),
};

export default postController;
