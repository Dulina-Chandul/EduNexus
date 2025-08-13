import asyncHandler from "express-async-handler";
import User from "../models/User/User.model.js";

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    // get the login user
    const user = await User.findById(req.user);

    // check user plan
    if (user?.role !== "admin") {
      return res.status(401).json({
        message: "Access denied, you are not an admin",
      });
    }

    next();
  } catch (error) {
    return res.json(error);
  }
});

export default isAdmin;
