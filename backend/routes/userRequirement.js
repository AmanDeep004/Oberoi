const express = require('express');
const router = express.Router();

const UserRequiremnetCont = require("../controllers/userRequirementController");


router.post("/saveUserRequirements/:hotelId", UserRequiremnetCont.saveUserRequiremnetNew)

module.exports = router;
