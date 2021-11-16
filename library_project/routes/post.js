const express = require("express");
const { Post, Comment } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    await Post.create({
      email: req.user.email,
      nick: req.user.nick,
      title: req.body.writeTitle,
      content: req.body.writeContent,
      UserId: req.user.id,
      snsId: req.user.snsId,
    });
    res.redirect("/board/page/1");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/delete/:id", isLoggedIn, async (req, res, next) => {
  try {
    await Post.update(
      { deleted: true },
      { where: { UserId: req.user.id, id: req.params.id } }
    );

    res.redirect("/board/page/1");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/comment/:id", isLoggedIn, async (req, res, next) => {
  try {
    await Comment.create({
      UserId: req.user.id,
      snsId: req.user.snsId,
      PostId: req.params.id,
      email: req.user.email,
      nick: req.user.nick,
      content: req.body.writeContent,
    });
    res.redirect("/board/" + req.params.id);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/comment/delete/:id", isLoggedIn, async (req, res, next) => {
  try {
    const postId = await Comment.findOne({ where: { id: req.params.id } });

    await Comment.destroy({
      where: { UserId: req.user.id, id: req.params.id },
    });
    res.redirect("/board/" + postId.PostId);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
