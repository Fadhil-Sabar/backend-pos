//utils
const ErrorResponse = require("../utils/errorResponse");
const jwt = require('jsonwebtoken');
const { authModel } = require("../models");
const crypt = require("../utils/encryptDecrypt");

const controller = {};

controller.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await authModel.user.findOne({ where: { username } });
    // Jika user tidak ditemukan, kirimkan pesan kesalahan
    if (!user) {
      return res.status(400).json({
        code: "1",
        msg: "User tidak di temukan"
      });
    }

    // Verifikasi password menggunakan bcrypt
    const passwordMatch = password == crypt.decrypt(user.password);

    // Jika password tidak cocok, kirimkan pesan kesalahan
    if (!passwordMatch) {
      return res.status(401).json({
        code: "1",
        msg: "Username atau password salah"
      });

    }

    const token = jwt.sign({ id: user.id_user, username: user.username, level: user.level }, process.env.SALT, { expiresIn: '8h' });

    res.status(200).json({
      code: "1",
      msg: "Login berhasil",
      dataRec: token
    });
  } catch (error) {
    res.status(401).json({
      code: "0",
      msg: "Login gagal",
    });
  }
};

module.exports = controller;
