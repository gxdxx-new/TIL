const express = require("express");
const { Book, User } = require("../models");
const router = express.Router();

const request = require("request");
const parse = require("json-parse");

router.get("/library/", async (req, res, next) => {
  const url =
    "http://apis.data.go.kr/6260000/BookNewListService/getBookNewList";
  let queryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    "=Gc%2FEM8UVhS6aGwllwxru0f09DP%2Bu%2FNUYy74JAjUFf7FC6q1%2Bf0vz6C5Cz7uxuOtw7X8HrhsWE98kcd%2F9PfX9sw%3D%3D"; /* Service Key*/
  queryParams +=
    "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("2"); /* */
  queryParams +=
    "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /* */
  queryParams +=
    "&" +
    encodeURIComponent("resultType") +
    "=" +
    encodeURIComponent("json"); /* */
  queryParams +=
    "&" +
    encodeURIComponent("title_info") +
    "=" +
    encodeURIComponent(req.query.search_book); /* */
  // queryParams +=
  //   "&" +
  //   encodeURIComponent("shelf_date") +
  //   "=" +
  //   encodeURIComponent("2021/09/14"); /* */
  // queryParams +=
  //   "&" +
  //   encodeURIComponent("author") +
  //   "=" +
  //   encodeURIComponent(
  //     "브래드 멜처 글 ; 크리스토퍼 엘리오풀로스 그림 ; 마술연필 옮김"
  //   ); /* */

  request(
    {
      url: url + queryParams,
      method: "GET",
    },
    function (error, response, body) {
      console.log("Status", response.statusCode);
      console.log("Headers", JSON.stringify(response.headers));
      console.log("Reponse received", body);
      console.log("@#!!#");
      const obj = JSON.parse(body);
      books = obj.getBookNewList.item;
      console.log(books[0]);
      console.log(obj.getBookNewList.item[0].publisher);
      console.log(obj.getBookNewList.item[1].publisher);
      console.log("@!#");

      res.render("searchResult", {
        title: "YU도서",
        books: books,
      });
    }
  );

  // try {
  //   const books = await Book.findAll({
  //     where: {
  //       title: req.query.search_book,
  //     },
  //     order: [["createdAt", "DESC"]],
  //   });
  //   // res.render("index", {
  //   //   title: "YU도서",
  //   //   books: books,
  //   // });
  //   res.redirect("/#board");
  // } catch (err) {
  //   console.error(err);
  //   next(err);
  // }
});

module.exports = router;
