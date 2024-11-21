const express = require("express");
const router = express.Router();

const DecorItemController = require("../controllers/decorItemController");

router.get("/byHotelId/:hotelId", DecorItemController.getDecorItemByHotelId);
router.get("/:id", DecorItemController.getDecorItemById);
router.post("/byCategory", DecorItemController.getDecorItemByCategory);
router.post("/", DecorItemController.saveDecorItemById);
router.patch("/", DecorItemController.updateDecorItemById);
router.delete("/", DecorItemController.deleteDecorItemById);

module.exports = router;
