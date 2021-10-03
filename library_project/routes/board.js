const express = require("express");
const { Post, User } = require("../models");
const router = express.Router();

router.get("/page/:page", async (req, res) => {
  try {
    let pageNum = req.params.page; // 요청 페이지 넘버
    let offset = 0;
    console.log(req.params.page);
    if (pageNum > 1) {
      offset = 2 * (pageNum - 1);
    }

    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });

    const currentPosts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
      offset: offset,
      limit: 2,
    });
    // res.redirect("/");
    res.render("board2", {
      title: "YU도서",
      posts: posts,
      currentPosts: currentPosts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
