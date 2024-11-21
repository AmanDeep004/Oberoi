const express = require("express");
const router = express.Router();

const newFoodpackageController = require("../controllers/newFoodpackgeController");

router.get("/byHotelId/:id", newFoodpackageController.getFoodpackageByHotelId);
router.get("/:id", newFoodpackageController.getFoodPackageById);
router.post("/", newFoodpackageController.saveFoodPackage);
router.patch("/", newFoodpackageController.updateFoodPackage);
router.delete("/", newFoodpackageController.deleteFoodPackage);

module.exports = router;
