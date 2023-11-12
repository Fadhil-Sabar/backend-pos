const Sequelize = require("sequelize");
const db = require("../database");

const databaseOptions = {
  freezeTableName: true,
  timestamps: false,
};

const transaksi = db.define(
  "transaksi",
  {
      id_transaksi: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tgl_transaksi: {
        type: Sequelize.DATE,
      },
      id_kasir: {
        type: Sequelize.INTEGER,
      },
      no_antrian: {
        type: Sequelize.INTEGER,
      }
      // created_at: {
      //     type: Sequelize.TIME,
      // },
      // updated_at: {
      //     type: Sequelize.TIME,
      // },
  },
  databaseOptions
);

const transaksi_detail = db.define(
  "transaksi_detail",
  {
      id_transaksi_Detail: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_transaksi: {
        type: Sequelize.INTEGER,
      },
      id_menu: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      harga_menu: {
        type: Sequelize.INTEGER,
      }
      // created_at: {
      //     type: Sequelize.TIME,
      // },
      // updated_at: {
      //     type: Sequelize.TIME,
      // },
  },
  databaseOptions
);

transaksi.hasMany(transaksi_detail)
transaksi_detail.hasOne(transaksi)

module.exports = {
  transaksi,
  transaksi_detail,
};
