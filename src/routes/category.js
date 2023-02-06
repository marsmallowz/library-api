const express = require("express");
const router = express.Router();
const { categoryController } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.get("/", categoryController.getCategories);
router.post("/", verifyToken, categoryController.createCategory);
router.patch("/:category_id", verifyToken, categoryController.updateCategory);
router.delete("/:category_id", verifyToken, categoryController.deleteCategory);

module.exports = router;
