const Sequelize = require("sequelize");

module.exports = class Comment extends Sequelize.Model {
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
        content: {
          type: Sequelize.STRING(100),
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Comment",
        tableName: "comments",
        paranoid: true,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Comment.belongsTo(db.Post);
    db.Comment.belongsTo(db.User);
  }
};
