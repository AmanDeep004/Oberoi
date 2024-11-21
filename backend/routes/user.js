const express = require("express");
const router = express.Router();
const Authenticator = require("../middleware/authenticator")
const UserController = require("../controllers/userController");
const rateLimit = require('express-rate-limit')
const interactionController = require("../controllers/interactionController");
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    message: {
        code: 429,
        message: "You have exceeded the 5 requests in 1-hour limit!",
        standardHeaders: true,
    },
    legacyHeaders: false,
});
/** all hotels API */
router.get("/allHotels", UserController.GetAllHotels);
router.get("/getHotelById/:hotelId", UserController.GetHotelById);
router.get("/getHotelByName/:hotelName", Authenticator.AuthUser, UserController.GetHotelDetailsbyName);
router.get("/allHalls/:hotelId", Authenticator.AuthUser, UserController.GetAllHalls);

/**food category */
router.get("/foodCategory", Authenticator.AuthUser, UserController.GetAllFoodCategory);
router.get("/foodCategory/:id", Authenticator.AuthUser, UserController.getFoodCategoryById);

/**food Items */
router.get("/foodItem/:categoryid/:hotelId", Authenticator.AuthUser, UserController.getFoodItemByCategory);
router.get("/foodItem/:hotelId", Authenticator.AuthUser, UserController.getFoodItemByHotelId);
router.get("/foodItem/:id", Authenticator.AuthUser, UserController.getFoodItemById);

/**food packages */
router.get("/foodPackage/:hotelId", Authenticator.AuthUser, UserController.getFoodpackageByHotelId);
router.get("/foodPackage/:id", Authenticator.AuthUser, UserController.getFoodPackageById);

/** decor category */
router.get("/decorCategory", Authenticator.AuthUser, UserController.getAllDecorCategory);
router.get("/decorCategory/:id", Authenticator.AuthUser, UserController.getDecorCategoryById);

/** Decor Items */
router.get("/decorItem/:hotelId", Authenticator.AuthUser, UserController.getDecorItemByHotelId);
router.get("/decorItem/:id", Authenticator.AuthUser, UserController.getDecorItemById);
router.get("/decorItem:/categoryId/:hotelId", Authenticator.AuthUser, UserController.getDecorItemByCategory);

/** entertainment Category */
router.get("/entertainCategory", Authenticator.AuthUser, UserController.getAllEntertainmentCategory);
router.get("/entertainCategoryById/:id", Authenticator.AuthUser, UserController.getEntertainmentCategoryById);

/** entertainment items */
router.get("/enterItem/:hotelId", Authenticator.AuthUser, UserController.getEntertainmentItemByHotelId);
router.get("/enterItem/:id", Authenticator.AuthUser, UserController.getEntertainmentItemById);
router.get("/enterItem/:categoryId/:hotelId", Authenticator.AuthUser, UserController.getEntertainmentItemByCategory);

/**to capture user's requirement */
router.post("/saveUserRequirements/:hotelId", Authenticator.AuthUser, UserController.saveUserRequiremnetNew);
// router.post("/smtp", UserController.smtpHandler);

/**to capture all interactions */
router.post("/saveInteraction", Authenticator.AuthUser, interactionController.saveInteraction);

module.exports = router;
