//utils
const ErrorResponse = require("../utils/errorResponse");
const SuccessResponse = require("../utils/successReponse");
const db = require("../database");
const { menuModel } = require("../models");
const crypt = require("../utils/encryptDecrypt");

const controller = {};

controller.init = async (req, res, next) => {
  try {

    return res.status(200).json({
      code: "1",
      msg: "Success"
    });
  } catch (error) {
    res.status(200).json({
      code: "0",
      msg: error.message,
    });
  }
};

controller.menuList = async (req, res, next) => {
  try {
    let [getData] = await db.query(`
      select id_menu, nama_menu, harga_menu from menu
    `)

    getData = getData.map((data) => ({
      ...data,
      id_menu: crypt.encrypt(data.id_menu.toString())
    }))

    return res.status(200).json({
      code: getData.length ? "1" : "0",
      msg: getData.length ? "Success" : "Failed",
      dataRec: getData
    });
  } catch (error) {
    return res.status(200).json({
      code: "0",
      msg: error.message,
    });
  }
};

controller.createMenu = async (req, res, next) => {
  const { nama_menu, harga_menu } = req.body;

  let t;

  try {
    if(!nama_menu || !harga_menu) throw new ErrorResponse('All Field Required!', '400')

    t = await db.transaction({
      autocommit: false,
    });

    const menuu = await menuModel.menu.create(
      {
        nama_menu,
        harga_menu
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    return SuccessResponse(res);
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    next(error);
  }
};

controller.updateMenu = async (req, res, next) => {
  const { id_menu, nama_menu, harga_menu } = req.body;

  let t;

  try {
    if (!id_menu) throw new ErrorResponse("Id is Required", 400);
    const decryptedId = crypt.decrypt(id_menu);

    const findMenu = await menuModel.menu.findOne({
      where: { id_menu: decryptedId },
      attributes: ["id_menu"],
      raw: true,
    });

    if (!findMenu) throw new ErrorResponse("User not found", 404);

    t = await db.transaction({
      autocommit: false,
    });

    await menuModel.menu.update(
      {
        nama_menu, harga_menu
      },
      {
        where: { id_menu: decryptedId },
        transaction: t,
      }
    );

    await t.commit();
    return SuccessResponse(res);
  } catch (err) {
    if (t) await t.rollback();
    next(err);
  }
};

controller.deleteMenu = async (req, res, next) => {
  const { id_menu } = req.query;

  let t;

  try {
    if (!id_menu) throw new ErrorResponse("Id is Required", 400);

    const decryptedId = crypt.decrypt(id_menu);

    t = await db.transaction({
      autocommit: false,
    });

    const findMenu = await menuModel.menu.findOne({
      where: { id_menu: decryptedId },
      attributes: ["id_menu"],
      raw: true,
    });

    if (!findMenu) throw new ErrorResponse("User not found", 404);

    await menuModel.menu.destroy({
      where: { id_menu: findMenu.id_menu },
    });

    await t.commit();
    return SuccessResponse(res);
  } catch (err) {
    if (t) await t.rollback();
    next(err);
  }
};

module.exports = controller;
