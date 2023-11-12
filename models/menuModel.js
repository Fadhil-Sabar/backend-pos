const Sequelize = require("sequelize");
const db = require("../database");

const databaseOptions = {
    freezeTableName: true,
    timestamps: false,
};

const menu = db.define(
    "menu",
    {
        id_menu: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        harga_menu: {
            type: Sequelize.INTEGER,
        },
        nama_menu: {
            type: Sequelize.STRING,
        }
    },
    databaseOptions
);

module.exports = {
    menu,
};
