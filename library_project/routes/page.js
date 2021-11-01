const express = require("express");
const { Post, User, Book } = require("../models");
//const crawl = require("../crawler/crawl");
const router = express.Router();

const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = async () => {
  try {
    return await axios.get("https://slib.yu.ac.kr/clicker/k");
    // axios.get 함수를 이용하여 비동기로 영남대 도서관의 html 파일을 가져온다.
  } catch (error) {
    console.error(error);
  }
};

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get("/", async (req, res) => {
  try {
    const userBooks = await Book.findAll({
      include: {
        model: User,
        attributes: ["email", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });

    const seats = await getHtml().then((html) => {
      let ulList = [];
      const $ = cheerio.load(html.data);
      const $bodyList = $("table.clicker_libtech_table_list tbody").children(
        "tr"
      );
      $bodyList.each(function (i, elem) {
        ulList[i] = {
          // title: $(this).find("td.clicker_align_left").text(),
          // seats: $(this).find("td.clicker_align_right").text(),
          // remaingSeats: $(this)
          //   .find("td.clicker_align_right.clicker_font_bold")
          //   .text(),
          // usingRates: $(this).find("b").text(),
          title: $(this).children("td:eq(0)").text(),
          seats: $(this).children("td:eq(1)").text(),
          remaingSeats: $(this).children("td:eq(2)").text(),
          usingRates: $(this).children("td:eq(3)").text(),
        };
      });
      const data = ulList.filter((n) => n.title);
      return data;
    });
    res.render("index", {
      title: "YU도서",
      userBooks: userBooks,
      seats: seats,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// router.get("/join", (req, res) => {
//   res.render("join", { title: "회원가입 - YU도서" });
// });

module.exports = router;
