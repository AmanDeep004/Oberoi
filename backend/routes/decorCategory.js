const express = require("express");
const router = express.Router();

const decorCategoryController = require("../controllers/decorCategoryController");

router.get("/", decorCategoryController.getAllDecorCategory);
router.get("/:id", decorCategoryController.getDecorCategoryById);
router.post("/", decorCategoryController.saveDecorcategory);
router.patch("/", decorCategoryController.updateDecorcategoryById);
router.delete("/:id", decorCategoryController.deleteDecorCategoryById);

module.exports = router;
