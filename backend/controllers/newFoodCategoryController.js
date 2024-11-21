const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require("../helpers/logging");
const NAMESPACE = "FOOD Controller";
const FoodCategory = require("../models/foodCategory");

const getFoodCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const foodCategory = await FoodCategory.findById(id).exec();
    if (!foodCategory) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Item doesn't exists";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    var rs = new iResponse(HTTPCodes.SUCCESS, foodCategory);
    rs.msg = "Item found Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(
      NAMESPACE,
      "getFoodCategory",
      "getFoodCategory exception",
      ex
    );
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const saveFoodcategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "All Fields are required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const foodCategory = new FoodCategory({
      name,
    });
    await foodCategory.save();
    var rs = new iResponse(HTTPCodes.SUCCESS, {});
    rs.msg = "Item saved Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(
      NAMESPACE,
      "getFoodCategory",
      "getFoodCategory exception",
      ex
    );
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const updateFoodcategoryById = async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "All Fields are required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const foodCategory = await FoodCategory.findById(id).exec();
    name
      ? foodCategory?.name == name
      : (foodCategory.name = foodCategory?.name);
    await foodCategory.save();
    var rs = new iResponse(HTTPCodes.SUCCESS, {});
    rs.msg = "Item updated Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(
      NAMESPACE,
      "getFoodCategory",
      "getFoodCategory exception",
      ex
    );
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const deleteFoodCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    await FoodCategory.findByIdAndDelete(id).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, {});
    rs.msg = "Item Deleted Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(
      NAMESPACE,
      "getFoodCategory",
      "getFoodCategory exception",
      ex
    );
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const getAllFoodCategory = async (req, res) => {
  try {
    const foodCategory = await FoodCategory.find().exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, foodCategory);
    rs.msg = "Item found Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(
      NAMESPACE,
      "getFoodCategory",
      "getFoodCategory exception",
      ex
    );
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

module.exports = {
  getFoodCategoryById,
  saveFoodcategory,
  updateFoodcategoryById,
  deleteFoodCategoryById,
  getAllFoodCategory
};
