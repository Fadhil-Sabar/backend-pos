const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const { protect } = require("../middleware/token");

router.get("/transaksiList", protect, controller.transaksiController.transaksiList);

router.post("/createTransaksi", protect, controller.transaksiController.createTransaksi);

router.put("/updateTransaksi", protect, controller.transaksiController.updateTransaksi);

router.delete("/deleteTransaksi", protect, controller.transaksiController.deleteTransaksi);

module.exports = router;
