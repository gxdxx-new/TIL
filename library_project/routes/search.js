const express = require("express");
const { Book, Loan, Recommend, Reserve } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

const request = require("request");

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
    encodeURIComponent(req.query.library_book);

  request(
    {
      url: url + queryParams,
      method: "GET",
    },
    async function (error, response, body) {
      const obj = JSON.parse(body);
      books = obj.getBookNewList.item;
      for (var key in books) {
        var loanBook = await Book.findOne({
          where: {
            title: books[key].title_info,
          },
        });
        if (loanBook !== null) {
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
    const loanCount = await Book.findAll({ where: { UserId: req.user.id } });
    if (loanCount.length >= 2) {
      return res.send(
        "<script>alert('최대 2권 대출 가능합니다.');history.back();</script>"
      );
    }
    const recommend = await Recommend.findOne({
      where: {
        title: req.query.title_info,
      },
    });

    if (recommend === null) {
      await Recommend.create({
        count: 1,
        title: req.query.title_info,
        author: req.query.author,
        publisher: req.query.publisher,
        publicationYear: req.query.pub_year,
        page: req.query.page,
        price: req.query.price,
        img: req.query.image,
      });
    } else {
      await Recommend.update(
        {
          count: recommend.count + 1,
        },
        { where: { title: req.query.title_info } }
      );
    }
    const reserve = await Reserve.findOne({
      where: { title: req.query.title_info },
    });
    if (reserve !== null) {
      if (reserve.UserId === req.user.id) {
        await Reserve.destroy({ where: { UserId: req.user.id } });
      } else {
        await Reserve.update(
          {
            returned: false,
          },
          {
            where: { title: req.query.title_info },
          }
        );
      }
    }
    await Book.create({
      UserId: req.user.id,
      loan: true,
      title: req.query.title_info,
      author: req.query.author,
      publisher: req.query.publisher,
      publicationYear: req.query.pub_year,
      page: req.query.page,
      price: req.query.price,
      img: req.query.image,
    });
    return res.redirect("/login/" + req.user.id);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/loan/return/:id", isLoggedIn, async (req, res, next) => {
  try {
    const book = await Book.findOne({
      where: {
        id: req.params.id,
      },
    });
    2;
    await Loan.create({
      loanDate: book.dataValues.createdAt,
      title: book.dataValues.title,
      author: book.dataValues.author,
      publisher: book.dataValues.publisher,
      publicationYear: book.dataValues.publicationYear,
      page: book.dataValues.page,
      price: book.dataValues.price,
      img: book.dataValues.img,
      UserId: req.user.id,
    });
    await Reserve.update(
      {
        returned: true,
      },
      {
        where: { title: book.dataValues.title },
      }
    );
    await Book.destroy({ where: { id: req.params.id } });
    res.redirect("/#loan");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/reserve", isLoggedIn, async (req, res, next) => {
  try {
    const reserveCount = await Reserve.findAll({
      where: { UserId: req.user.id },
    });
    if (reserveCount.length >= 1) {
      return res.send(
        "<script>alert('최대 1권 예약 가능합니다.');history.back();</script>"
      );
    }
    const book = await Book.findOne({
      where: { title: req.query.title_info, UserId: req.user.id },
    });
    if (book !== null) {
      if (book.title === req.query.title_info) {
        return res.send(
          "<script>alert('내가 대출한 책을 예약할 수 없습니다.');history.back();</script>"
        );
      }
    }
    const reserve = await Reserve.findOne({
      where: { title: req.query.title_info },
    });
    if (reserve !== null) {
      if (reserve.reserved === true) {
        return res.send(
          "<script>alert('이미 예약된 책입니다.');history.back();</script>"
        );
      }
      await Reserve.update(
        {
          UserId: req.user.id,
          reserved: true,
          returned: false,
        },
        {
          where: { title: req.query.title_info },
        }
      );
    } else {
      await Reserve.create({
        title: req.query.title_info,
        author: req.query.author,
        publisher: req.query.publisher,
        publicationYear: req.query.pub_year,
        page: req.query.page,
        price: req.query.price,
        img: req.query.image,
        UserId: req.user.id,
        reserved: true,
        returned: false,
      });
    }
    res.redirect("/login/" + req.user.id);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/recommend", async (req, res, next) => {
  try {
    const recommend = await Recommend.findAll({
      order: [["count", "DESC"]],
      limit: 10,
    });
    res.render("recommend", { recommends: recommend });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

var client_id = "Q_oU6NvlzQaFG47fBaxL";
var client_secret = "2ateLNCG4Q";

router.get("/book.json", function (req, res) {
  var api_url =
    "https://openapi.naver.com/v1/search/book?query=" +
    encodeURI(req.query.naver_book); // json 결과
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
      books[key].title = title;
    }

    for (let key in books) {
      let description = books[key].description;
      description = description.replace(/<b>/g, "");
      description = description.replace(/<\/b>/g, "");
      books[key].description = description;
    }
    res.render("searchResultNaver", {
      title: "YU도서",
      books: books,
    });
  });
});

module.exports = router;
