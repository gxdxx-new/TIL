const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        title: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
        hit: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: true,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
  }
};
