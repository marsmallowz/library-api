const express = require("express");
const router = express.Router();
const { bookController } = require("../controllers");

router.post("/", bookController.getBooks);
router.get("/:book_id", bookController.bookDetails);

module.exports = router;
