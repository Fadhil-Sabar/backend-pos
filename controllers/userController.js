const db = require("../database");
const { Op } = require("sequelize");
const { userModel } = require("../models");
const crypt = require("../utils/encryptDecrypt");
const SuccessResponse = require("../utils/successReponse");
const ErrorResponse = require("../utils/errorResponse");

const userController = {};

userController.userList = async (req, res, next) => {
  const { page = 1, sort = "ASC", limit = 10 } = req.query;
  const pageInt = Number(page);
  const limitInt = Number(limit);
  const offset = (pageInt - 1) * limitInt;

  const whereAnd = [];
  if (req.level) whereAnd.push({ level: { [Op.gt]: req.level } });
  try {
    const users = await userModel.user.findAll(
      {
        where: {
          [Op.and]: whereAnd,
        },
        // limit: limitInt,
        // offset: offset,
        // order: [["created_at", sort]],
        attributes: {
          exclude: ["created_at", "updated_at"],
        },
      },
      {
        raw: true,
      }
    );

    const newUsers = users.map((user) => {
      user.dataValues.id_user = crypt.encrypt(user.id_user.toString());
      return user;
    });

    const pagination = {
      page: page,
      limit: limit,
      record: newUsers.length,
    };

    return SuccessResponse(res, newUsers, pagination);
  } catch (error) {
    next(error);
  }
};

userController.createUser = async (req, res, next) => {
  const { name, username, password, level } = req.body;

  let t;

  try {
    t = await db.transaction({
      autocommit: false,
    });

    let decryptedPassword = crypt.encrypt('k4fe1n2k23');

    const create = await userModel.user.create(
      {
        nama: name,
        username: username,
        password: decryptedPassword,
        level: level,
      },
      {
        transaction: t,
      }
    );

    if (create) {
      await t.commit();
      return SuccessResponse(res);
    }
  } catch (error) {
    if (t) await t.rollback();
    next(error);
  }
};

userController.updateUser = async (req, res, next) => {
  const { id_user, name, username, level } = req.body;

  let t;

  try {
    if (!id_user) throw new ErrorResponse("Id is Required", 400);
    const decryptedId = crypt.decrypt(id_user);

    const findUser = await userModel.user.findOne({
      where: { id_user: decryptedId },
      attributes: ["id_user"],
      raw: true,
    });

    if (!findUser) throw new ErrorResponse("User not found", 404);

    t = await db.transaction({
      autocommit: false,
    });

    await userModel.user.update(
      {
        nama: name,
        username: username,
        level: level,
      },
      {
        where: { id_user: decryptedId },
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

userController.deleteUser = async (req, res, next) => {
  const { id_user } = req.query;

  let t;

  try {
    if (!id_user) throw new ErrorResponse("Id is Required", 400);

    const decryptedId = crypt.decrypt(id_user);

    t = await db.transaction({
      autocommit: false,
    });

    const findUser = await userModel.user.findOne({
      where: { id_user: decryptedId },
      attributes: ["id_user"],
      raw: true,
    });

    if (!findUser) throw new ErrorResponse("User not found", 404);

    const deleteData = await userModel.user.destroy({
      where: { id_user: findUser.id_user },
    });

    await t.commit();
    return SuccessResponse(res);
  } catch (err) {
    if (t) await t.rollback();
    next(err);
  }
};

module.exports = userController;
