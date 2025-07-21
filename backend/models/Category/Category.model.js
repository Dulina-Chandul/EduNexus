import { Timestamp } from "bson";
import mongoose from "mongoose";

//* Schema
const categerySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//* Model
const Category = mongoose.model("Category", categerySchema);

export default Category;
