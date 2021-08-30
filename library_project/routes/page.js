const express = require("express");
const { Post, User } = require("../models");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("index", {
      title: "YU도서",
      posts: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입 - YU도서" });
});

module.exports = router;
