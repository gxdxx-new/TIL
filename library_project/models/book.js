const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        loan: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true,
        },
        author: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        publisher: {
          type: Sequelize.STRING(40),
          allowNull: false,
        },
        publicationYear: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        page: {
          type: Sequelize.STRING(40),
          defaultValue: 0,
          allowNull: false,
        },
        price: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },

      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Book",
        tableName: "books",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
  }
};
