const express = require("express");
const router = express.Router();
const authOTPController = require("../controllers/authOTPController");
const verifyJWT = require("../middleware/verifyJwt");
router.post("/generateOTP", authOTPController.generateOTP);
router.post('/generateGuestUser', authOTPController.generateGuestUser);
router.post("/verifyOTP", authOTPController.verifyOTP);
router.route("/getUserData").get(verifyJWT, authOTPController.getUserData);
router.post("/createGuestUser", authOTPController.createGuestUser)
module.exports = router;
