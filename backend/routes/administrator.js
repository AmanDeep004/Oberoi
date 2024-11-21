const express = require("express");
const router = express.Router();
const admin = require("../controllers/administratorController");
const utmController = require('../controllers/utmController')
const Authenticator = require("../middleware/authenticator")
const rateLimit = require('express-rate-limit')

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

/**admin login */
router.post("/login", admin.Login);
router.post("/forgotPassword", admin.ForgotPassword);
router.post("/resetPassword", admin.ResetPassword);

/**hotel related CRUD */
//router.get("/allHotels", Authenticator.AuthAdmin, admin.GetAllHotels);
router.get("/allHotels/:page/:perPage", Authenticator.AuthAdmin, admin.GetAllHotels);
router.get("/allHotels", Authenticator.AuthAdmin, admin.GetAllHotels1);
router.post("/addNewHotel", Authenticator.AuthAdmin, admin.SaveHotel);
router.delete("/deleteHotel/:hotelId", Authenticator.AuthAdmin, admin.DeleteHotelById);
router.get("getHotelById/:hotelId", Authenticator.AuthAdmin, admin.GetHotelById);
router.get("/editHotelInfo/:hotelId", Authenticator.AuthAdmin, admin.EditHotelInfo);
router.post("/updateHotelInfo", Authenticator.AuthAdmin, admin.UpdateHotelInfo);

/**hotel's room related CRUD */
router.get("/allRooms/:hotelId", Authenticator.AuthAdmin, admin.GetAllRooms1);
router.get("/allRooms/:hotelId/:page/:perPage", Authenticator.AuthAdmin, admin.GetAllRooms);
router.post("/addNewRoom", Authenticator.AuthAdmin, admin.SaveNewRoom);
router.put("/editRoom/:hotelId/:roomId", Authenticator.AuthAdmin, admin.EditHotelRoom);
router.post("/updateHotelRoom", Authenticator.AuthAdmin, admin.UpdateHotelRoom);
router.delete("/deleteRoom/:hotelId/:roomId", Authenticator.AuthAdmin, admin.DeleteHotelRoom);

/**Food categories CRUD*/
router.get("/foodCateListAll", Authenticator.AuthAdmin, admin.FoodCateListAll)
router.get("/foodCateList/:page/:perPage", Authenticator.AuthAdmin, admin.FoodCateList)
router.post("/foodCategoryData", Authenticator.AuthAdmin, admin.FoodCateData)
router.put("/foodCategoryUpd/:cateId", Authenticator.AuthAdmin, admin.FoodCateUpd)
router.delete("/foodCateDel/:cateId", Authenticator.AuthAdmin, admin.FoodCateDel)

/**Decor categories CRUD */
router.get("/decorCateListAll", Authenticator.AuthAdmin, admin.DecorCateListAll)
router.get("/decorCateList/:page/:perPage", Authenticator.AuthAdmin, admin.DecorCateList)
router.post("/decorCategoryData", Authenticator.AuthAdmin, admin.DecorCateData)
router.put("/decorCategoryUpd/:decorId", Authenticator.AuthAdmin, admin.DecorCateUpd)
router.delete("/decorCateDel/:decorId", Authenticator.AuthAdmin, admin.DecorCateDel)

/**Entertainment categories CRUD */
router.get("/entertainmentCateListAll/", Authenticator.AuthAdmin, admin.EntertainCateListAll)
router.get("/entertainmentCateList/:page/:perPage", Authenticator.AuthAdmin, admin.EntertainCateList)
router.post("/entertainmentCategoryData", Authenticator.AuthAdmin, admin.EntertainCateData)
router.put("/entertainmentCategoryUpd/:enterId", Authenticator.AuthAdmin, admin.EntertainCateUpd)
router.delete("/entertainmentCateDel/:enterId", Authenticator.AuthAdmin, admin.EntertainCateDel)

/**wedding Community CRUD */
router.get("/weddCateListAll", Authenticator.AuthAdmin, admin.WeddCateListAll)
router.get("/weddCateList/:page/:perPage", Authenticator.AuthAdmin, admin.WeddCateList)
router.post("/weddCategoryData", Authenticator.AuthAdmin, admin.WeddCateData)
router.put("/weddCategoryUpd/:weddId", Authenticator.AuthAdmin, admin.WeddCateUpd)
router.delete("/weddCateDel/:weddId", Authenticator.AuthAdmin, admin.WeddCateDel)

/**food items CRUD */
router.get("/foodList/:page/:perPage", Authenticator.AuthAdmin, admin.FoodList)
router.get("/foodList/:hotelId", Authenticator.AuthAdmin, admin.FoodListByHotelId)
router.get("/foodById/:id", Authenticator.AuthAdmin, admin.FoodById);
router.post("/foodDataNew", Authenticator.AuthAdmin, admin.FoodDataNew)
router.put("/foodupd/:foodId", Authenticator.AuthAdmin, admin.Foodupd)
router.delete("/foodDel/:foodId", Authenticator.AuthAdmin, admin.FoodDel)

/**Decor items CRUD */
router.get("/decorList/:page/:perPage", Authenticator.AuthAdmin, admin.DecorList)
router.get("/getDecorByHotelId/:hotelId", Authenticator.AuthAdmin, admin.GetDecorByHotelId)
router.get("/decorById/:id", Authenticator.AuthAdmin, admin.DecorById);
router.post("/decorDataNew", Authenticator.AuthAdmin, admin.DecorDataNew)

router.put("/decorupd/:decoritemId", Authenticator.AuthAdmin, admin.Decorupd)
router.delete("/decorDel/:decoritemId", Authenticator.AuthAdmin, admin.DecorDel)

/**Entertainment items CRUD */
router.get("/entertainmentList/:page/:perPage", Authenticator.AuthAdmin, admin.EntertainmentList)
router.get("/entertainmentList/:hotelId", Authenticator.AuthAdmin, admin.EntertainmentList1)
router.get("/entertainmentId/:id", Authenticator.AuthAdmin, admin.EntertainmentById);
router.post("/entertainmentDataNew", Authenticator.AuthAdmin, admin.EntertainmentDataNew)
router.put("/entertainmentupd/:enteritemId", Authenticator.AuthAdmin, admin.Entertainmentupd)
router.delete("/entertainmentDel/:enteritemId", Authenticator.AuthAdmin, admin.EntertainmentDel)

/**Food packages CRUD */
router.get("/foodpackageHotelId/:hotelId/:page/:perPage", Authenticator.AuthAdmin, admin.FoodpackageByHotelId);
router.get("/foodpackageByHotelId/:hotelId", Authenticator.AuthAdmin, admin.FoodpackageByHotelId2);
router.get("/foodPackageById/:id", Authenticator.AuthAdmin, admin.FoodPackageById);
router.post("/saveFoodPackage", Authenticator.AuthAdmin, admin.SaveFoodPackage);
router.put("/updateFoodPackage", Authenticator.AuthAdmin, admin.UpdateFoodPackage);
router.delete("/deleteFoodPackage/:packId", Authenticator.AuthAdmin, admin.DeleteFoodPackage);

//utms

router.get("/getAllUtms", Authenticator.AuthAdmin, utmController.getAllUtms);
router.post("/saveUtm", Authenticator.AuthAdmin, utmController.createUtm);
router.put("/editUtm/:utmId", Authenticator.AuthAdmin, utmController.updateUtm);
router.delete("/deleteUtm/:utmId", Authenticator.AuthAdmin, utmController.deleteUtm);

// router.get("/getAllUtms", Authenticator.AuthAdmin, utmController.getAllUtms);
// router.post("/saveUtm", Authenticator.AuthAdmin, utmController.createUtm);
// router.put("/editUtm/:utmId", Authenticator.AuthAdmin, utmController.updateUtm);
// router.delete("/deleteUtm/:utmId", Authenticator.AuthAdmin, utmController.deleteUtm);

/** userRequirements get Operations*/

router.get("/userRequirements", Authenticator.AuthAdmin, admin.UserRequirements);
router.get("/userRequirement/:hotelId", Authenticator.AuthAdmin, admin.UserRequirement);
router.get("/UserRequirementById/:id", admin.UserRequirementById);

/** user CRUD operation */
router.get("/users", Authenticator.AuthAdmin, admin.Users);
router.post("/users", Authenticator.AuthAdmin, admin.addUser);
router.put("/users", Authenticator.AuthAdmin, admin.updateUser);
router.delete("/users/:id", Authenticator.AuthAdmin, admin.deleteUser);

router.get("/getTop5allData/:stDate/:enDate", Authenticator.AuthAdmin, admin.getTop5allData);
router.get("/getTop5FoodData/:stDate/:enDate", Authenticator.AuthAdmin, admin.getTop5Food);
router.get("/getTop5EntData/:stDate/:enDate", Authenticator.AuthAdmin, admin.getTop5Ent);
router.get("/getTop5DecorData/:stDate/:enDate", Authenticator.AuthAdmin, admin.getTop5Decor);
router.get("/getTop5VenueData/:stDate/:enDate", Authenticator.AuthAdmin, admin.getTop5VenueData);

router.get('/loggedInUsers/:stDate/:enDate', Authenticator.AuthAdmin, admin.loggedInUsersList)
router.get('/getUtsSourceCount/:stDate/:enDate', Authenticator.AuthAdmin, admin.getUtsSourceData)



router.route("/getUserData").get(Authenticator.AuthAdmin, admin.getUserData);

module.exports = router