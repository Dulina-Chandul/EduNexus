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
};

export default userController;
