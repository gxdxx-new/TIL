const express = require("express");
const { Book, User } = require("../models");
const router = express.Router();

const request = require("request");
const parse = require("json-parse");

router.get("/library/", async (req, res, next) => {
  // await Book.create({
  //   loan: true,
  //   title: "오늘아, 안녕 : 더책",
  //   author: "김유진 글 ; 서현 그림",
  //   publisher: "창비",
  //   publicationYear: "2018",
  //   page: 28,
  //   price: "27000",
  //   img: "https://image-library.busan.go.kr/klascover/resources/images/2021-03-18/9788936455200",
  // });

  const url =
    "http://apis.data.go.kr/6260000/BookNewListService/getBookNewList";
  let queryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    "=Gc%2FEM8UVhS6aGwllwxru0f09DP%2Bu%2FNUYy74JAjUFf7FC6q1%2Bf0vz6C5Cz7uxuOtw7X8HrhsWE98kcd%2F9PfX9sw%3D%3D";
  queryParams +=
    "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("10");
  queryParams +=
    "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
  queryParams +=
    "&" + encodeURIComponent("resultType") + "=" + encodeURIComponent("json");
  queryParams +=
    "&" +
    encodeURIComponent("title_info") +
    "=" +
    encodeURIComponent(req.query.search_book);

  request(
    {
      url: url + queryParams,
      method: "GET",
    },
    async function (error, response, body) {
      console.log("Status", response.statusCode);
      console.log("Headers", JSON.stringify(response.headers));
      console.log("Reponse received", body);
      console.log("@#!!#");
      const obj = JSON.parse(body);
      books = obj.getBookNewList.item;
      console.log(books[0]);
      console.log(books[0].title_info);
      console.log(obj.getBookNewList.item[0].publisher);
      console.log("@!#");

      // var loanBook = await Book.findOne({
      //   // attributes: ["createdAt"],
      //   where: {
      //     title: books[0].title_info,
      //     loan: true,
      //   },
      // });
      // if (loanBook !== null) {
      //   console.log(loanBook.createdAt);
      // }

      for (var key in books) {
        // console.log(books[key].title_info);
        var loanBook = await Book.findOne({
          where: {
            title: books[key].title_info,
          },
        });

        // console.log(loanBook);
        if (loanBook !== null) {
          console.log(loanBook.createdAt);
          books[key].loan = true;
          books[key].createdAt = loanBook.createdAt;
        }
      }

      res.render("searchResult", {
        title: "YU도서",
        books: books,
        // loan: loanBook,
      });
    }
  );
});

router.get("/loan", async (req, res, next) => {
  try {
    await Book.create({
      loan: true,
      title: req.query.title_info,
      author: req.query.author,
      publisher: req.query.publisher,
      publicationYear: req.query.pub_year,
      page: req.query.page,
      price: req.query.price,
      img: req.query.image,
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
