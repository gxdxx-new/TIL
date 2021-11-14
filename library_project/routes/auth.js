const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { check, validationResult } = require("express-validator");
const User = require("../models/user");

const router = express.Router();

router.post(
  "/join",
  isNotLoggedIn,
  [
    check("joinEmail", "Invalid Email").isEmail(),
    check("joinPassword", "Invalid Password").isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { joinEmail, joinNick, joinPassword, joinConfirmPassword } = req.body;
    if (joinPassword !== joinConfirmPassword) {
      return res.redirect("/join?error=exist");
    }
    try {
      const exUser = await User.findOne({ where: { email: joinEmail } });
      if (exUser) {
        return res.redirect("/join?error=exist");
      }
      const hash = await bcrypt.hash(joinPassword, 12);
      await User.create({
        email: joinEmail,
        nick: joinNick,
        password: hash,
      });
      res.redirect("/");
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

router.post("/login", isNotLoggedIn, async (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      res.redirect("/" + req.user.id);
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
