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
      return res.send(
        "<script>alert('비밀번호가 일치하지 않습니다.');location.href='/#login';</script>"
      );
    }
    try {
      const exUser = await User.findOne({ where: { email: joinEmail } });
      if (exUser) {
        return res.send(
          "<script>alert('이미 존재하는 아이디입니다.');location.href='/#login';</script>"
        );
      }
      const exPhoneNumber = await User.findOne({
        where: { phoneNumber: req.body.joinPhoneNumber },
      });
      if (exPhoneNumber) {
        return res.send(
          "<script>alert('이미 존재하는 전화번호입니다.');location.href='/#login';</script>"
        );
      }

      const hash = await bcrypt.hash(joinPassword, 12);
      await User.create({
        email: joinEmail,
        nick: joinNick,
        password: hash,
        phoneNumber: req.body.joinPhoneNumber,
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
      return res.send(
        "<script>alert('아이디 또는 비밀번호가 틀렸습니다.');location.href='/#login';</script>"
      );
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      res.redirect("/login/" + req.user.id);
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
});

router.post("/find", isNotLoggedIn, async (req, res, next) => {
  try {
    let user = await User.findAll({
      where: { email: req.body.email, phoneNumber: req.body.phoneNumber },
    });

    const hash = await bcrypt.hash(req.body.password, 12);
    await User.update(
      {
        password: hash,
      },
      { where: { email: req.body.email } }
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
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
    res.redirect("/login/" + req.user.id);
  }
);

module.exports = router;
