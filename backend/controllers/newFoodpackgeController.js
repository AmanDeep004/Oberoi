const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require("../helpers/logging");
const NAMESPACE = "FOOD Controller";
const NewFoodPackage = require("../models/foodPackageNew");

const getFoodPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const foodPackage = await NewFoodPackage.findById(id)
      .populate({
        path: "foodCategories.categoryId",
        model: "NewFoodCategory",
        select: "name", // Specify the fields you want to select from the Category model
      })
      .exec();
    if (!foodPackage) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Item doesn't exists";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    var rs = new iResponse(HTTPCodes.SUCCESS, foodPackage);
    rs.msg = "Item found Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "getFoodItem", "getFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const getFoodpackageByHotelId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const foodPackage = await NewFoodPackage.find({ hotelId: id })
      .populate({
        path: "foodCategories.categoryId",
        model: "FoodCategory",
        select: "name", // Specify the fields you want to select from the Category model
      })
      .exec();
    if (!foodPackage) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Item doesn't exists";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    var rs = new iResponse(HTTPCodes.SUCCESS, foodPackage);
    rs.msg = "Item found Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "getFoodItem", "getFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const saveFoodPackage = async (req, res) => {
  try {
    const { name, hotelId, foodCategories } = req.body;
    console.log(name, hotelId, foodCategories);
    if (!name || !hotelId || !foodCategories) {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "Required fields are missing";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
    const foodPackage = new NewFoodPackage({
      name,
      hotelId,
      foodCategories,
    });
    await foodPackage.save();
    var rs = new iResponse(HTTPCodes.SUCCESS, {});
    rs.msg = "Item saved Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "getFoodItem", "getFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const updateFoodPackage = async (req, res) => {
  try {
    const { id, name, hotelId, foodCategories } = req.body;
    if (!name || !hotelId || foodCategories) {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "Required fields are missing";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
    const foodPackage = NewFoodPackage.findById(id).exec();
    if (!foodPackage) {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "Not found";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
    name ? (foodPackage.name = name) : (foodPackage.name = foodPackage.name);
    hotelId ? (foodPackage.hotelId = hotelId) : (foodPackage.hotelId = hotelId);
    foodCategories
      ? (foodPackage.foodCategories = foodCategories)
      : (foodPackage.foodCategories = foodPackage.foodCategories);
    await foodPackage.save();
    var rs = new iResponse(HTTPCodes.SUCCESS, {});
    rs.msg = "Item saved Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "getFoodItem", "getFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const deleteFoodPackage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    await NewFoodPackage.findByIdAndDelete(id).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, {});
    rs.msg = "Item Deleted Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "getFoodItem", "getFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

module.exports = {
  deleteFoodPackage,
  updateFoodPackage,
  getFoodPackageById,
  saveFoodPackage,
  getFoodpackageByHotelId
};
