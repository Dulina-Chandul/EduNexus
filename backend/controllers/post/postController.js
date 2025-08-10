import expressAsyncHandler from "express-async-handler";
import Post from "../../models/Post/Post.model.js";
import Category from "../../models/Category/Category.model.js";
import User from "../../models/User/User.model.js";

const postController = {
  //* Create Post
  createPost: expressAsyncHandler(async (req, res) => {
    console.log(req.file);

    //* Get the post data from the request body
    const { description, category } = req.body;

    //* Find the category by ID
    const categoryFound = await Category.findById(category);
    if (!categoryFound) {
      throw new Error("Category not found");
    }

    //* Find the User by ID
    const userFound = await User.findById(req.user);
    if (!userFound) {
      throw new Error("User not found");
    }

    const postCreated = await Post.create({
      description,
      image: req.file,
      author: req.user,
      category,
    });

    categoryFound.posts.push(postCreated);
    await categoryFound.save();

    userFound.posts.push(postCreated?._id);
    await userFound.save();

    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      post: postCreated,
    });
  }),

  //* List All Posts
  listAllPosts: expressAsyncHandler(async (req, res) => {
    // console.log(req.query);
    const { category, title, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }
    if (title) {
      filter.description = { $regex: title, $options: "i" };
    }

    const posts = await Post.find(filter)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalPosts = await Post.countDocuments(filter);
    res.status(200).json({
      status: "success",
      message: "Posts retrieved successfully",
      posts,
      currentPage: Number(page),
      perPage: Number(limit),
      totalPages: Math.ceil(totalPosts / limit),
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
