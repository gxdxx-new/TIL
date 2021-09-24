const express = require("express");
const { Book, User } = require("../models");
const router = express.Router();

router.get("/book/", async (req, res, next) => {
  try {
    const books = await Book.findAll({
      where: {
        book: req.query.search_book,
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("index", {
      title: "YU도서",
      books: books,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
