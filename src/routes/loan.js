const express = require("express");
const router = express.Router();
const { loanController } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.post("/:book_id", verifyToken, loanController.addBook);
router.get("/", verifyToken, loanController.getLoans);
router.patch("/:loan_id", verifyToken, loanController.returnLoan);

module.exports = router;
