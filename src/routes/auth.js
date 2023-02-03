const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
router.post("/v2", authController.login);

module.exports = router;
