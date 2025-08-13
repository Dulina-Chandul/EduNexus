import asyncHandler from "express-async-handler";
import User from "../models/User/User.model.js";

const isBlocked = asyncHandler(async (req, res, next) => {
  try {
    // get the login user
    const user = await User.findById(req.user);

    // check user plan
    if (user?.isBlocked) {
      return res.status(401).json({
        message: "You are blocked by the admin",
      });
    }

    next();
  } catch (error) {
    return res.json(error);
  }
});

export default isBlocked;
