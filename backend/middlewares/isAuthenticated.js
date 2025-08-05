import passport from "passport";

const isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.status(401).json({
        status: "error",
        message: info ? info?.message : "User not authenticated",
        error: error ? error?.message : "undefined",
        isAuthenticated: false,
      });
    }

    req.user = user?._id;
    return next();
  })(req, res, next);
};

export default isAuthenticated;
