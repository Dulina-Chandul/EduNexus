import expressAsyncHandler from "express-async-handler";
import User from "../../models/User/User.model.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";

const userController = {
  //* Create a new user
  register: expressAsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

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
    });

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
        res.redirect("http://localhost:5173/dashboard");
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
};

export default userController;
