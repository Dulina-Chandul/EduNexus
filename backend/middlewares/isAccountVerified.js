import User from "../models/User/User.model.js";
import expressAsyncHandler from "express-async-handler";

const isAccountVerified = expressAsyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    if (!user?.isEmailVerified) {
      throw new Error("Email not verified");
    }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message || "Forbidden",
    });
  }
});

export default isAccountVerified;
