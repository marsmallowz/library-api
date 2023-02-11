const express = require("express");
const router = express.Router();
const { bookController } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");
const { fileUploader, upload } = require("../middlewares/multer");

router.post("/", bookController.getBooks);
router.get("/:book_id", bookController.bookDetails);
router.delete("/:book_id", verifyToken, bookController.deleteBook);
router.post(
  "/v1",
  fileUploader({
    destinationFolder: "book",
    fileType: "image",
    prefix: "POST",
  }).single("image"),
  bookController.createBook
);
router.patch("/:book_id", verifyToken,
fileUploader({
    destinationFolder: "book",
    fileType: "image",
    prefix: "POST",
  }).single("image"),
 bookController.updateBook);
module.exports = router;
