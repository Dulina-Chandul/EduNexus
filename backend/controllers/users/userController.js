import expressAsyncHandler from "express-async-handler";
import User from "../../models/User/User.model.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";
import sendAccountVerificationEmail from "../../utils/sendAccountVerificationEmail.js";
import crypto from "crypto";
import sendPasswordResetEmail from "../../utils/sendPasswordResetEmail.js";
import StudentProfile from "../../models/User/studentProfile.model.js";

const userController = {
  //* Fetching all users
  getAllUsers: expressAsyncHandler(async (req, res) => {
    const users = await User.find({})
      .select(
        "-password -passwordResetToken -accountVerificationToken -accountVerificationExpires -passwordResetExpires"
      )
      .populate("followers")
      .populate("following")
      .populate("posts");
    if (!users || users.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No users found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      users,
    });
  }),

  //* Create a new user
  register: expressAsyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;
    let newStudentProfile = undefined;

    //* Check if user already exists
    const userFound = await User.findOne({ username, email });

    if (userFound) {
      throw new Error("User already exists");
    }

    //* Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //* Create user
    const userCreated = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    if (userCreated.role === "student") {
      newStudentProfile = await StudentProfile.create({
        userId: userCreated._id,
      });
    }

    userCreated.studentProfile = newStudentProfile._id;
    await newStudentProfile.save();
    await userCreated.save();

    //* Send the response to the client side
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: userCreated,
    });
  }),

  //* User Login
  login: expressAsyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);

      //* If user is not found
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: info.message,
        });
      }

      //* Generate JWT token
      const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      //* set token in cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      //* Send the response to the client side
      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        username: user?.username,
        email: user?.email,
        role: user?.role,
        _id: user?._id,
      });
    })(req, res, next);
  }),

  //* Google OAuth
  googleAuth: passport.authenticate("google", { scope: ["profile"] }),

  //* Google OAuth Callback
  googleAuthCallback: expressAsyncHandler(async (req, res, next) => {
    passport.authenticate(
      "google",
      {
        failureRedirect: "/login",
        session: false,
      },
      (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.redirect("http://localhost:5173/google-login-error");
        }

        //* Generate JWT token
        const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
          expiresIn: "3d",
        });
        //* set token in cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        //* Redirect to the frontend with user data
        res.redirect("http://localhost:5173/student-dashboard");
      }
    )(req, res, next);
  }),

  //* Check user authentication
  checkAuthenticated: expressAsyncHandler(async (req, res) => {
    const token = req.cookies["token"];
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
        isAuthenticated: false,
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "User not found",
          isAuthenticated: false,
        });
      } else {
        return res.status(200).json({
          status: "success",
          message: "User is authenticated",
          isAuthenticated: true,
          _id: user?._id,
          username: user?.username,
          email: user?.email,
          profilePicture: user?.profilePicture,
          role: user?.role,
        });
      }
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired token",
        isAuthenticated: false,
        error: error,
      });
    }
  }),

  //* Logout
  logout: expressAsyncHandler(async (req, res) => {
    res.cookie("token", "", { maxAge: 1 });
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  }),

  //* Get user profile
  getUserProfile: expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user)
      .populate("followers")
      .populate("following")
      .populate("posts")
      .select(
        "-password -passwordResetToken -accountVerificationToken -accountVerificationExpires -passwordResetExpires"
      );
    res.json({
      user,
    });
  }),

  //* Following a user
  followUser: expressAsyncHandler(async (req, res) => {
    const { followId } = req.params;
    console.log(req.user);
    const userId = req.user;

    if (userId.toString() === followId.toString()) {
      throw new Error("You cannot follow yourself");
    }

    const userToFollow = await User.findById(followId);
    if (!userToFollow) {
      throw new Error("User to follow not found");
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { following: followId },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      followId,
      {
        $addToSet: { followers: userId },
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "User followed successfully",
    });
  }),

  //* Unfollow a user
  unfollowUser: expressAsyncHandler(async (req, res) => {
    const userId = req.user;
    const unfollowId = req.params.unfollowId;

    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);
    if (!user) {
      throw new Error("User not found");
    }
    if (!unfollowUser) {
      throw new Error("User to unfollow not found");
    }
    if (userId.toString() === unfollowId.toString()) {
      throw new Error("You cannot unfollow yourself");
    }
    user.following.pull(unfollowId);
    unfollowUser.followers.pull(userId);
    await user.save();
    await unfollowUser.save();
    res.status(200).json({
      status: "success",
      message: "User unfollowed successfully",
    });
  }),

  //* Verify user email
  verifyEmail: expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }

    //* Check if email is exist
    if (!user?.email) {
      throw new Error("Email not found, please add Email");
    }

    //* Calling the method from the schema
    const emailToken = await user.generateAccountVerificationToken();

    await user.save();

    await sendAccountVerificationEmail(user?.email, emailToken);
    return res.status(200).json({
      status: "success",
      message: `Verification email sent successfully to your email. It will expire in 10 minutes.`,
    });
  }),

  //* Verify user email with token
  verifyAccount: expressAsyncHandler(async (req, res) => {
    const { token } = req.params;

    const cryptoToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      accountVerificationToken: cryptoToken,
      accountVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired token");
    }

    user.isEmailVerified = true;
    user.accountVerificationToken = null;
    user.accountVerificationExpires = null;

    // console.log(user);
    await user.save();

    res.json({
      status: "success",
      message: "Email verified successfully",
      userRole: user.role,
    });
  }),

  //* Forgot Password (This is for sending the reset password email)
  requestPasswordReset: expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    if (user.authMethod !== "local") {
      throw new Error(
        "You can only reset password for account created with email and password"
      );
    }

    const resetToken = user.generatePasswordResetToken();

    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      status: "success",
      message: `Password reset email sent to ${email}. It will expire in 10 minutes.`,
    });
  }),

  //* Reset Password (This is for resetting the password)
  resetPassword: expressAsyncHandler(async (req, res) => {
    const { verifyToken } = req.params;
    const { newPassword } = req.body;

    const passwordResetToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    const userFound = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!userFound) {
      throw new Error("Invalid or expired password reset token");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    userFound.password = hashedPassword;
    userFound.passwordResetToken = null;
    userFound.passwordResetExpires = null;

    await userFound.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  }),

  //* Update email
  updateEmail: expressAsyncHandler(async (req, res) => {
    const { email } = req.body;

    console.log("Updating email to:", email);

    console.log("Current email:", req.user, "user.email");

    //* Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email is already in use");
      throw new Error("Email is already in use");
    }

    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }

    console.log("user", user);

    user.email = email;
    user.isEmailVerified = false;
    await user.save();

    try {
      const token = await user.generateAccountVerificationToken();
      await sendAccountVerificationEmail(user.email, token);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
    }

    res.status(200).json({
      status: "success",
      message: "Email updated successfully. Please verify your new email.",
    });
  }),

  //* Update user profile picture
  updateProfilePicture: expressAsyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user,
      {
        $set: {
          profilePicture: req.file,
        },
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Profile picture updated successfully",
    });
  }),

  //* Block the user
  blockUser: expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({
      status: "success",
      message: "User blocked successfully",
      username: user.username,
      isBlocked: user.isBlocked,
    });
  }),

  //* Unblock the user
  unblockUser: expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({
      status: "success",
      message: "User unblocked successfully",
      username: user.username,
      isBlocked: user.isBlocked,
    });
  }),
};

export default userController;
