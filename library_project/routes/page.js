const express = require("express");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = null;
  next();
});

router.get("/", (req, res) => {
  res.render("main", { title: "YU도서", user: req.user });
});

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입 - YU도서" });
});

module.exports = router;
