const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_PASSWORD,
        callbackURL: "http://www.libraryproject.ga/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("google profile", profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "google" },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile.emails[0].value,
              nick: "google",
              snsId: profile.id,
              provider: "google",
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
