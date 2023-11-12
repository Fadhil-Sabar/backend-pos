const authModel = require('./authModel')
const menuModel = require('./menuModel')
const userModel = require('./userModel')
const transaksiModel = require('./transaksiModel')

const models = {}

models.authModel = authModel
models.menuModel = menuModel
models.userModel = userModel
models.transaksiModel = transaksiModel

module.exports = models