const express = require("express");
const router = express.Router();

const EntertainmentItemController = require("../controllers/entertainmentItemController");

router.get("/byHotelId/:hotelId", EntertainmentItemController.getEntertainmentItemByHotelId);
router.get("/:id", EntertainmentItemController.getEntertainmentItemById);
router.post("/byCategory", EntertainmentItemController.getEntertainmentItemByCategory);
router.post("/", EntertainmentItemController.saveEntertainmentItemById);
router.patch("/", EntertainmentItemController.updateEntertainmentItemById);
router.delete("/", EntertainmentItemController.deleteEntertainmentItemById);

module.exports = router;
