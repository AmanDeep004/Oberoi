const UserRequirement = require("../models/userRequirement");
const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require("../helpers/logging");
const UserRequirementNew = require("../models/userRequirementsNew");
const NAMESPACE = "UserRequirement Controller";

const getAllUsersRequirement = async (req, res) => {
  try {
    logging.info(
      NAMESPACE,
      "getAllUserRequirements",
      "getAllUserRequirements called"
    );
    const hotelId = req.params.hotelId;
    const items = await UserRequirement.find({ hotelId: hotelId }).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, items);
    rs.msg = "User Requirements data Fetched Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(
      NAMESPACE,
      "getAllUserRequirements",
      "getAllUserRequirements exception",
      ex
    );
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const getUserRequirementById = async (req, res) => {
  try {
    logging.info(
      NAMESPACE,
      "getAllUserRequirements",
      "getAllUserRequirements called"
    );
    const { id } = req.params;
    const item = await UserRequirement.findById(id).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, item);
    rs.msg = "User Requirements data Fetched Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(
      NAMESPACE,
      "getAllUserRequirements",
      "getAllUserRequirements exception",
      ex
    );
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const SaveNewUserRequirement = async (req, res) => {
  try {
    logging.info(NAMESPACE, "User Requirement", "saveUserRequirement ");
    const {
      hotelId,
      eventType,
      numberOfPersons,
      clusterOrTheatre,
      foodType,
      alacarte,
      selectedPackage,
      drinks,
      decor,
      entertainment,
      userData,
    } = req.body;

    const reqirement = new UserRequirement({
      hotelId,
      eventType,
      numberOfPersons,
      clusterOrTheatre,
      foodType,
      alacarte,
      selectedPackage,
      drinks,
      decor,
      entertainment,
      userData,
    });
    await reqirement.save();
    var rs = new iResponse(HTTPCodes.SUCCESS, {});
    rs.msg = "Item Saved Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(
      NAMESPACE,
      "User Requirement saved",
      "User Requirement exception",
      ex
    );
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

/**to save the user Requirement */
const saveUserRequiremnetNew = async (req, res) => {
  try {
    logging.info(NAMESPACE, "User Requirement", "saveUserRequiremnetNew");
    var userRequireData = new UserRequirementNew({
      hotelId: req.params.hotelId,
      event: req.body.event,
      isWedding: req.body.isWedding,
      other: req.body.other,
      community: req.body.community,
      programs: req.body.programs,
      eventType: req.body.eventType,
      stDate: req.body.stDate,
      enDate: req.body.enDate,
      guest: req.body.guest,
      sitArrangement: req.body.sitArrangement,
      venue: req.body.venue,
      isAlaCarte: req.body.isAlaCarte,
      compositionName: req.body.compositionName,
      isDrinks: req.body.isDrinks,
      isCustomMenu: req.body.isCustomMenu,
      isCustomDecor: req.body.isCustomDecor,
      isCustomEntertainment: req.body.isCustomEntertainment,
      isAssociateProgramFood: req.body.isAssociateProgramFood
    })

    var data = await userRequireData.save();
    var rs = new iResponse(HTTPCodes.SUCCESS, data);
    rs.msg = "Requirement saved";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  }
  catch (ex) {
    logging.error(NAMESPACE, "User Requirement", "saveUserRequiremnetNew  Exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
}

module.exports = {
  SaveNewUserRequirement,
  getAllUsersRequirement,
  getUserRequirementById,
  saveUserRequiremnetNew
};
