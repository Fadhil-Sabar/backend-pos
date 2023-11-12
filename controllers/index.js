const authController = require('./authController')
const menuController = require('./menuController')
const transaksiController = require('./transaksiController')
const userController = require('./userController')

const controller = {}

controller.authController = authController
controller.menuController = menuController
controller.userController = userController
controller.transaksiController = transaksiController

module.exports = controller