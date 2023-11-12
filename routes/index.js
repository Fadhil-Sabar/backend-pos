const authRouter = require('./authRouter')
const menuRouter = require('./menuRouter')
const userRouter = require('./userRouter')
const transaksiRouter = require('./transaksiRouter')

const routes = {}

routes.authRouter = authRouter
routes.menuRouter = menuRouter
routes.userRouter = userRouter
routes.transaksiRouter = transaksiRouter

module.exports = routes