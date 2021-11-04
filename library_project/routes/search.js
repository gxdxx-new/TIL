const express = require("express");
const { Book, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

const request = require("request");
const parse = require("json-parse");

router.get("/library", async (req, res, next) => {
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

      for (var key in books) {
        var loanBook = await Book.findOne({
          where: {
            title: books[key].title_info,
          },
        });

        if (loanBook !== null) {
          console.log(loanBook.createdAt);
          books[key].loan = true;
          books[key].createdAt = loanBook.createdAt;
        }
      }

      res.render("searchResult", {
        title: "YU도서",
        books: books,
      });
    }
  );
});

router.get("/loan", isLoggedIn, async (req, res, next) => {
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

var client_id = "Q_oU6NvlzQaFG47fBaxL";
var client_secret = "2ateLNCG4Q";

router.get("/book.json", function (req, res) {
  console.log(req.query.query);

  var api_url =
    "https://openapi.naver.com/v1/search/book?query=" +
    encodeURI(req.query.query); // json 결과
  var request = require("request");
  var options = {
    url: api_url,
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };
  request.get(options, function (error, response, body) {
    books = JSON.parse(body).items;

    for (let key in books) {
      let title = books[key].title;
      title = title.replace(/<b>/g, "");
      title = title.replace(/<\/b>/g, "");
      console.log(title);

      books[key].title = title;
    }

    for (let key in books) {
      let description = books[key].description;
      description = description.replace(/<b>/g, "");
      description = description.replace(/<\/b>/g, "");
      console.log(description);

      books[key].description = description;
    }

    console.log(books);
    res.render("searchResultNaver", {
      title: "YU도서",
      books: books,
    });
  });
});

module.exports = router;
