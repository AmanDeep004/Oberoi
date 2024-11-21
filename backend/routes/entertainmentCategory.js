const express = require("express");
const router = express.Router();

const entertainmentCategoryController = require("../controllers/entertainmentCategoryController");

router.get("/", entertainmentCategoryController.getAllEntertainmentCategory);
router.get("/:id", entertainmentCategoryController.getEntertainmentCategoryById);
router.post("/", entertainmentCategoryController.saveEntertainmentcategory);
router.patch("/", entertainmentCategoryController.updateEntertainmentcategoryById);
router.delete("/:id", entertainmentCategoryController.deleteEntertainmentCategoryById);

module.exports = router;
