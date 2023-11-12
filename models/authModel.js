const Sequelize = require("sequelize");
const db = require("../database");

const databaseOptions = {
    freezeTableName: true,
    timestamps: false,
};

const user = db.define(
    "user",
    {
        id_user: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nama: {
            type: Sequelize.STRING,
        },
        username: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        level: {
            type: Sequelize.ENUM("1", "2"),
        },
        // created_at: {
        //     type: Sequelize.TIME,
        // },
        // updated_at: {
        //     type: Sequelize.TIME,
        // },
    },
    databaseOptions
);

module.exports = {
    user,
};
