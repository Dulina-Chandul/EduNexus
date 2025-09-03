import mongoose from "mongoose";
import crypto from "crypto";

//* Schema
const userSchema = new mongoose.Schema(
  {
    // Basic user information
    username: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: Object,
      default: null,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
    },
    authMethod: {
      type: String,
      enum: ["google", "local", "facebook", "github"],
      required: true,
      default: "local",
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    accountVerificationToken: {
      type: String,
      default: null,
    },
    accountVerificationExpires: {
      type: Date,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "guest"],
      default: "student",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isBlocked: {
      type: Boolean,
      default: false,
    },
    studentProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAccountVerificationToken = function () {
  // console.log(this);
  const user = this;

  const emailToken = crypto.randomBytes(20).toString("hex");
  // console.log(emailToken);
  user.accountVerificationToken = crypto
    .createHash("sha256")
    .update(emailToken)
    .digest("hex");
  user.accountVerificationExpires = Date.now() + 10 * 60 * 1000;

  return emailToken;
};

//* Generating token for the password reset
userSchema.methods.generatePasswordResetToken = function () {
  const user = this;

  const passwordToken = crypto.randomBytes(20).toString("hex");

  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(passwordToken)
    .digest("hex");

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return passwordToken;
};

//* Model
const User = mongoose.model("User", userSchema);
export default User;
