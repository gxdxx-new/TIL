const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Book = require("./book");
const Post = require("./post");
const Comment = require("./comment");

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Book = Book;
db.Post = Post;
db.Comment = Comment;

User.init(sequelize);
Book.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Book.associate(db);
Post.associate(db);
Comment.associate(db);

module.exports = db;
