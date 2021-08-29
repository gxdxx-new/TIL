const express = require("express");
const { Post, User } = require("../models");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get("/", (req, res) => {
  res.render("index", {
    title: "YU도서",
    user: req.user,
  });
});

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입 - YU도서" });
});

module.exports = router;
