const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");
const helmet = require("helmet");
const hpp = require("hpp");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);

dotenv.config();
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});
const pageRouter = require("./routes/page");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const boardRouter = require("./routes/board");
const searchRouter = require("./routes/search");
const { sequelize } = require("./models");
const passportConfig = require("./passport");
const logger = require("./logger");

const app = express();
app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");
passportConfig();
nunjucks.configure("views", {
  express: app,
  watch: true,
});
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60,
  },
  store: new RedisStore({ client: redisClient }),
};
if (process.env.NODE_ENV === "production") {
  sessionOption.proxy = true;
  app.enable("trust proxy");
  app.use(morgan("combined"));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/board", boardRouter);
app.use("/search", searchRouter);

app.use((req, res, next) => {
  // 404 처리 미들웨어
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  logger.info("hello");
  logger.error(error.message);
  next(error);
});

app.use((err, req, res, next) => {
  // 에러 미들웨어
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
