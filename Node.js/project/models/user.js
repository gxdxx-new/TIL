const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.User.hasMany(db.Post);
        // 팔로잉 팔로워 구분하기 위해 foreignKey
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId', // followingId를 검색해서 팔로워들을 알 수 있음
            as: 'Followers',
            through: 'Follow',
        });
        db.User.belongsToMany(db.User, { // followerId를 검색해서 누굴 팔로잉 하는지 알 수 있음
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
    }
};