const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Post = require("./post");
const Book = require("./book");

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Book = Book;

User.init(sequelize);
Post.init(sequelize);
Book.init(sequelize);

User.associate(db);
Post.associate(db);
Book.associate(db);

module.exports = db;
