const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const { protect } = require("../middleware/token");

router.get(
  "/menuInit",
  controller.menuController.init
);

router.get(
  "/menuList",
  protect,
  controller.menuController.menuList
);

router.post(
  "/createMenu",
  protect,
  controller.menuController.createMenu
);
router.put(
  "/updateMenu",
  protect,
  controller.menuController.updateMenu
);
router.delete(
  "/deleteMenu",
  protect,
  controller.menuController.deleteMenu
);

module.exports = router;
