const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("./middlewares");
const { Book, User, Comment, Post } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.render("adminLogin");
});

router.post("/login", async (req, res, next) => {
  if (req.body.email !== "admin@yu.ac.kr") {
    return res.send(
      "<script>alert('관리자만 로그인 가능합니다.');location.href='/admin';</script>"
    );
  }
  if (req.body.password !== "000000") {
    return res.send(
      "<script>alert('관리자만 로그인 가능합니다.');location.href='/admin';</script>"
    );
  }

  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.send(
        "<script>alert('로그인실패');location.href='/';</script>"
      );
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      res.redirect("./page");
    });
  })(req, res, next);
});

router.get("/page", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user.id !== 1) {
      return res.send(
        "<script>alert('관리자만 로그인 가능합니다.');location.href='/admin';</script>"
      );
    }

    let users = await User.findAll({});
    let loanCount = [];
    let postCount = [];
    let commentCount = [];
    for (let i = 0; i < users.length; i++) {
      loanCount[i] = await Book.findAll({ where: { UserId: users[i].id } });
      users[i].loanCount = loanCount[i].length;
      postCount[i] = await Post.findAll({ where: { UserId: users[i].id } });
      users[i].postCount = postCount[i].length;
      commentCount[i] = await Comment.findAll({
        where: { UserId: users[i].id },
      });
      users[i].commentCount = commentCount[i].length;
    }

    res.render("adminPage", {
      title: "YU도서",
      users: users,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/google", async (req, res) => {
  try {
    res.redirect(
      "https://analytics.google.com/analytics/web/?authuser=0#/p293561683/realtime/overview?params=_u..nav%3Dmaui"
    );
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
