import expressAsyncHandler from "express-async-handler";
import Post from "../../models/Post/Post.model.js";
import Category from "../../models/Category/Category.model.js";
import Comment from "../../models/Comment/Comment.model.js";

const commentsController = {
  //* Create Comment
  createComment: expressAsyncHandler(async (req, res) => {
    const { postId, comment } = req.body;

    const postFound = await Post.findById(postId);
    if (!postFound) {
      throw new Error("Post not found");
    }

    const newComment = await Comment.create({
      content: comment,
      post: postId,
      author: req.user,
    });

    postFound.comments.push(newComment?._id);
    await postFound.save();

    res.status(201).json({
      status: "success",
      message: "Comment created successfully",
      comment: newComment,
    });
  }),

  //* List All Categories
  listAllCategories: expressAsyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json({
      status: "success",
      message: "Categories retrieved successfully",
      categories,
    });
  }),

  //* Update Category
  updateCategory: expressAsyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const categoryFound = await Category.findById(categoryId);
    if (!categoryFound) {
      throw new Error("Category not found");
    }

    const categoryUpdated = await Category.findByIdAndUpdate(
      categoryId,
      {
        categoryName: req.body.categoryName,
        description: req.body.description,
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      category: categoryUpdated,
    });
  }),

  //* Get Category
  getCategory: expressAsyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const categoryFound = await Category.findById(categoryId);
    if (!categoryFound) {
      throw new Error("Category not found");
    }
    res.status(200).json({
      status: "success",
      message: "Category retrieved successfully",
      category: categoryFound,
    });
  }),

  //* Delete Category
  deleteCategory: expressAsyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  }),
};

export default commentsController;
