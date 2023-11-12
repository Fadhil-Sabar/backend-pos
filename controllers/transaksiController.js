//utils
const ErrorResponse = require("../utils/errorResponse");
const SuccessResponse = require("../utils/successReponse");
const db = require("../database");
const { transaksiModel, userModel } = require("../models");
const crypt = require("../utils/encryptDecrypt");

const controller = {};

controller.transaksiList = async (req, res, next) => {
  try {
    let where = ''
    if(req.query.id_transaksi){
      const decryptedId = crypt.decrypt(req.query.id_transaksi)
      where += `where t.id_transaksi = ${decryptedId}`
    }

    let [getData] = await db.query(`
      select t.id_transaksi
        , date_format(t.tgl_transaksi, '%m-%d-%Y %H:%i') "tgl_transaksi"
        , u.nama "nama_kasir"
        , t.no_antrian
      from transaksi t
      left join user u on t.id_kasir = u.id_user
      ${where}
      order by t.tgl_transaksi
    `, {
      raw: true
    })

    let [getDataDetail] = await db.query(`
      select id_transaksi_detail
      , td.id_transaksi
      , m.nama_menu
      , td.quantity
      , td.harga_menu
      from transaksi_detail td
      inner join menu m on td.id_menu = m.id_menu
    `)
    getData = getData.map((data) => {
      let findDetail = getDataDetail.filter((det) => det.id_transaksi == data.id_transaksi) || []
      if(findDetail && findDetail.length){
        findDetail = findDetail.map((det) => ({
          ...det,
          id_transaksi: crypt.encrypt(det.id_transaksi.toString()),
          id_transaksi_detail: crypt.encrypt(det.id_transaksi_detail.toString()),
        }))
      }
      return {
        ...data,
        id_transaksi: crypt.encrypt(data.id_transaksi.toString()),
        detail_transaksi: findDetail
      }
    })

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

controller.createTransaksi = async (req, res, next) => {
  const { data, createdBy } = req.body;

  let t;

  try {
    if(!data.length) throw new ErrorResponse('Data Required!', '400')

    t = await db.transaction({
      autocommit: false,
    });

    const findUser = await userModel.user.findOne({
      where: {
        username: createdBy
      },
      attributes: ['id_user'],
    })
    if(!findUser?.dataValues?.id_user) throw new ErrorResponse('User tidak ditemukan!', 400)

    const getLastTransaction = await db.query(`
      select no_antrian from transaksi order by no_antrian desc limit 1
    `, {
      plain: true
    })

    const createTransaksi = await transaksiModel.transaksi.create({
      id_kasir: findUser.dataValues.id_user,
      no_antrian: getLastTransaction.no_antrian + 1
    }, {
      returning: true,
      transaction: t
    })
    
    const payload = data.map((item) => {
      const decryptedId = crypt.decrypt(item.idMenu)
      return {
        id_transaksi: createTransaksi.dataValues.id_transaksi,
        id_menu: decryptedId,
        quantity: Number(item.quantity),
        harga_menu: Number(item.hargaMenu)
      }
    })

    await transaksiModel.transaksi_detail.bulkCreate(payload, {
      transaction: t
    })

    await t.commit();
    return SuccessResponse(res);
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    next(error);
  }
};

controller.updateTransaksi = async (req, res, next) => {
  const { id_transaksi, data } = req.body;
  let t;

  t = await db.transaction({
    autocommit: false,
  });

  try {
    if(!id_transaksi) throw new ErrorResponse('Id Transaksi Required!', '400')
    if(!data.length) throw new ErrorResponse('Data Required!', '400')

    const decryptedId = crypt.decrypt(id_transaksi)
    const findTransaksi = await transaksiModel.transaksi.findOne({
      where: {
        id_transaksi: decryptedId
      },
      attributes: ['id_transaksi'],
    })

    if(!findTransaksi?.dataValues?.id_transaksi) throw new ErrorResponse('Transaksi tidak ditemukan!', 400)

    await transaksiModel.transaksi_detail.destroy({
      where: {
        id_transaksi: findTransaksi?.dataValues?.id_transaksi
      },
      transaction: t
    })
    
    const payload = data.map((item) => {
      const decryptedId = crypt.decrypt(item.idMenu)
      return {
        id_transaksi: findTransaksi.dataValues.id_transaksi,
        id_menu: decryptedId,
        // id_menu: item.idMenu,
        quantity: Number(item.quantity),
        harga_menu: Number(item.hargaMenu)
      }
    })
    await transaksiModel.transaksi_detail.bulkCreate(payload, {
      transaction: t
    })

    await t.commit();
    return SuccessResponse(res);
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    next(error);
  }
};

controller.deleteTransaksi = async (req, res, next) => {
  const { id_transaksi } = req.query;

  let t;

  t = await db.transaction({
    autocommit: false,
  });
  try {
    if (!id_transaksi) throw new ErrorResponse("Id is Required", 400);

    const decryptedId = crypt.decrypt(id_transaksi);

    const findTransaksi = await transaksiModel.transaksi.findOne({
      where: { id_transaksi: decryptedId },
      attributes: ["id_transaksi"],
      raw: true,
    });

    if (!findTransaksi) throw new ErrorResponse("Transaksi not found", 404);

    await transaksiModel.transaksi.destroy({
      where: { id_transaksi: findTransaksi.id_transaksi },
      transaction: t
    });

    await transaksiModel.transaksi_detail.destroy({
      where: { id_transaksi: findTransaksi.id_transaksi },
      transaction: t
    });

    await t.commit();
    return SuccessResponse(res);
  } catch (err) {
    if (t) await t.rollback();
    next(err);
  }
};

module.exports = controller;
