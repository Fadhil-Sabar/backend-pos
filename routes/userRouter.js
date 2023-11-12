const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const { protect } = require("../middleware/token");

router.get("/userList", protect, controller.userController.userList);

router.post("/createUser", protect, controller.userController.createUser);

router.put("/updateUser", protect, controller.userController.updateUser);

router.delete("/deleteUser", protect, controller.userController.deleteUser);


// router.get("/getAllUser", controller.userController.getAllUser);

// router.post("/createUser", controller.userController.createUser);

// router.put("/updateUser", controller.userController.updateUser);

// router.delete("/deleteUser", controller.userController.deleteUser);

module.exports = router;
