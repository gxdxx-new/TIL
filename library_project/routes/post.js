const express = require("express");
const { Post, Comment } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

// 게시글 업로드
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    await Post.create({
      email: req.user.email,
      nick: req.user.nick,
      title: req.body.writeTitle,
      content: req.body.writeContent,
      UserId: req.user.id,
    });
    res.redirect("/board/page/1");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/comment/:id", isLoggedIn, async (req, res, next) => {
  try {
    await Comment.create({
      PostId: req.params.id,
      email: req.user.email,
      nick: req.user.nick,
      content: req.body.writeContent,
    });
    console.log("@#!!#!");
    console.log(req.body.writeContent);
    console.log(req.body.anonymousCheck);
    console.log(req.params.id);
    res.redirect("/board/" + req.params.id);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
