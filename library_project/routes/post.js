const express = require("express");
const { Post } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

// 게시글 업로드
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    await Post.create({
      title: req.body.writeTitle,
      content: req.body.writeContent,
      UserId: req.user.id,
    });
    res.redirect("/#board");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
