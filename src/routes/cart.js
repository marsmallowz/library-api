const express = require("express");
const router = express.Router();
const { cartController } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.post("/:book_id", verifyToken, cartController.addBook);
router.delete("/:book_id", verifyToken, cartController.deleteBook);

module.exports = router;
