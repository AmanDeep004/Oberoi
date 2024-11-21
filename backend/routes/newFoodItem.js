const express = require("express");
const router = express.Router();
const newFoodItemController = require("../controllers/newFoodItemController");

router.post("/byCategory", newFoodItemController.getFoodItemByCategory);
router.get("/byHotelId/:hotelId", newFoodItemController.getFoodItemByHotelId);
router.get("/:id", newFoodItemController.getFoodItemById);
router.post("/", newFoodItemController.saveFoodItemById);
router.patch("/", newFoodItemController.updateFoodItemById);
router.delete("/", newFoodItemController.deleteFoodItemById);

module.exports = router;
