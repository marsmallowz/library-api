const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");

router.post("/v2", authController.login);
router.post("/v1", authController.register);
module.exports = router;