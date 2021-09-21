const express = require("express");
const { Post, User } = require("../models");
const router = express.Router();

router.get("/page/1", async (req, res) => {
  try {
    let pageNum = req.query.page; // 요청 페이지 넘버
    let offset = 0;

    if (pageNum > 1) {
      offset = 2 * (pageNum - 1);
    }

    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
      offset: offset,
      limit: 2,
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

module.exports = router;
