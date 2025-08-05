import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User/User.model.js";
import bcrypt from "bcryptjs";
import { ExtractJwt } from "passport-jwt";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

//* Configuring passport

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        //* Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

//* JWT Options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies["token"];
      }
      return token;
    },
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

//* JWT
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

//* Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        const {
          id,
          displayName,
          name,
          _json: { picture },
        } = profile;

        let email = "";
        if (Array.isArray(profile?.emails) && profile?.emails?.length > 0) {
          email = profile.emails[0].value;
        }
        if (!user) {
          user = await User.create({
            googleId: id,
            username: displayName || name.givenName,
            profilePicture: picture,
            email,
            authMethod: "google",
          });
        }

        return done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
