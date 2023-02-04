const express = require("express");
const router = express.Router();
const { bookController } = require("../controllers");

router.get("/", bookController.getBooks2);
module.exports = router;
