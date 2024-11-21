const express = require("express");
const loginController = require("../controllers/loginController");
const hotelController = require("../controllers/hotelController");
const adminController = require("../controllers/adminController");
const foodController = require("../controllers/foodController");
const foodPackageController = require("../controllers/foodPackageController");
const decorController = require("../controllers/decorController");
const userRequirementController = require("../controllers/userRequirementController");
const entertainmentController = require("../controllers/entertainmentController");
const { AuthAdmin } = require("../helpers/auth");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// const verifyJWT = require("../middleware/verifyJwt")

router.get("/", adminController.Home);
router.get("/bookings", adminController.GetAllBookings);
// router.get('/login', adminController.Home);
router.post("/login", loginController.Login);
router.get("/logout", loginController.Logout);

// router.get('/dashboard', AuthAdmin, adminController.Dashboard);
router.get("/allUsers", adminController.GetAllUsers);
router.get("/editUser/:userId", adminController.EditUserInfo);

// router.post('/updateNewUser', AuthAdmin, adminController.UpdateUser);
router.post("/updateNewUser", adminController.UpdateUser);
// router.get('/addNewUser', AuthAdmin, adminController.AddUser);

//add new user
router.post(
  "/addNewUser",
  [
    check("email", "Email is not valid").isEmail().normalizeEmail(),
    check("password", "This password must me 8+ characters long")
      .exists()
      .isLength({ min: 8 }),
  ],
  adminController.SaveUser
);

// router.get('/deleteUser/:userId', AuthAdmin, adminController.DeleteUserById);
router.delete("/deleteUser/:userId", adminController.DeleteUserById);

//hotels
router.get("/allHotels", hotelController.GetAllHotels);
router.post("/addNewHotel", hotelController.SaveHotel);
router.delete("/deleteHotel/:hotelId", hotelController.DeleteHotelById);

// router.get('/addNewHotel', AuthAdmin, adminController.AddHotel);
router.get("/hotels/getHotelById/:hotelId", hotelController.GetHotelById);
router.get("/editHotelInfo/:hotelId", hotelController.EditHotelInfo);
router.post("/updateHotelInfo", hotelController.UpdateHotelInfo);

//get hotel details by hotelname
router.get("/hotels/getHotelByName/:hotelName", hotelController.GetHotelDetailsbyName);
router.post("/hotels/hotelWithName", hotelController.AddHotelDetailsbyName);

router.get("/allRooms/:hotelId", adminController.GetAllRooms);
router.post("/addNewRoom", adminController.SaveNewRoom);
router.get("/editRoom/:hotelId/:roomIndex", adminController.EditHotelRoom);
router.post("/updateHotelRoom", adminController.UpdateHotelRoom);
router.delete("/deleteRoom/:hotelId/:roomIndex", adminController.DeleteHotelRoom);

//get all halls whose venue vizualizer is enabled
router.get("/allHalls/:hotelId", adminController.GetAllHalls);

//new requirements added

//userRequirement
router.get("/getAllUsersRequirement/:hotelId", userRequirementController.getAllUsersRequirement);
router.get(
  "/getUsersRequirementById/:id",
  userRequirementController.getUserRequirementById
);
router.post(
  "/addNewRequirements",
  userRequirementController.SaveNewUserRequirement
);

//food items
router.get("/getAllFoodItems/:hotelId", foodController.getAllFoodItems);
router.post("/addNewFoodItem", foodController.saveFoodItem);
router.put("/updateFoodItem", foodController.EditFoodItem);
router.delete("/deleteFoodItem/:id", foodController.deleteFoodItem);
router.get("/getFoodItem/:id", foodController.getFoodItem);

//entertainment
router.get("/getAllEntertainment/:hotelId", entertainmentController.getAllEntertainment);
router.post("/addNewEntertainment", entertainmentController.saveEntertainment);
router.put("/updateEntertainment", entertainmentController.editEntertainment);
router.delete("/deleteEntertainment/:id", entertainmentController.deleteEntertainment);
router.get("/getEntertainment/:id", entertainmentController.getEntertainmentById);

//food Package
router.get("/getAllFoodPackages/:hotelId", foodPackageController.getAllFoodPackages);
router.post("/addNewFoodPackage", foodPackageController.saveFoodPackage);
router.put("/updateFoodPackage", foodPackageController.editFoodPackage);
router.delete("/deleteFoodPackage/:id", foodPackageController.deleteFoodPackage);
router.get("/getFoodPackage/:id", foodPackageController.getFoodPackage);

//decor
router.get("/getAllDecors/:hotelId", decorController.getAlldecor);
router.post("/addNewDecor", decorController.saveDecor);
router.put("/updateDecor", decorController.editDecor);
router.delete("/deleteDecor/:id", decorController.deleteDecor);
router.get("/getDecor/:id", decorController.getDecorById);

// bookings
router.get("/bookings", adminController.GetAllBookings);
router.delete("deleteBooking/:id", adminController.DeleteBooking);

module.exports = router;
