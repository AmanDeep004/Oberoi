const express = require("express");
const router = express.Router();
const newFoodCategoryController = require("../controllers/newFoodCategoryController");

router.get("/", newFoodCategoryController.getAllFoodCategory);
router.get("/:id", newFoodCategoryController.getFoodCategoryById);
router.post("/", newFoodCategoryController.saveFoodcategory);
router.patch("/", newFoodCategoryController.updateFoodcategoryById);
router.delete("/:id", newFoodCategoryController.deleteFoodCategoryById);

module.exports = router;
