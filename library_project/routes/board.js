const express = require("express");
const { Post, User, Comment } = require("../models");
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
      },
      order: [["createdAt", "DESC"]],
    });

    const currentPosts = await Post.findAll({
      include: {
        model: User,
      },
      order: [["createdAt", "DESC"]],
      offset: offset,
      limit: 2,
    });
    console.log(currentPosts);
    // res.redirect("/");
    res.render("board", {
      title: "YU도서",
      posts: posts,
      currentPosts: currentPosts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let post = await Post.findOne({
      include: {
        model: Comment,
      },
      where: { id: req.params.id },
    });

    await Post.update(
      {
        hit: post.hit + 1,
      },
      { where: { id: req.params.id } }
    );

    // let comment = await Comment.findAll({
    //   include: {
    //     model: Post,
    //     where: { id: req.params.id },
    //   },
    // });
    console.log(post.Comments[0]);

    res.render("post", {
      title: "YU도서",
      post: post,
      comments: post.Comments,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
