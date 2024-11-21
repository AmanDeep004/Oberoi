const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require("../helpers/logging");
const NAMESPACE = "FOOD Controller";
const EntertainmentCategory = require("../models/entertainmentCategory");

const getEntertainmentCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const entertainmentCategory = await EntertainmentCategory.findById(id).exec();
    if (!entertainmentCategory) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Item doesn't exists";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    var rs = new iResponse(HTTPCodes.SUCCESS, entertainmentCategory);
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

const saveEntertainmentcategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "All Fields are required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const entertainmentCategory = new EntertainmentCategory({
      name,
    });
    await entertainmentCategory.save();
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

const updateEntertainmentcategoryById = async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "All Fields are required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const entertainmentCategory = await EntertainmentCategory.findById(id).exec();
    name
      ? entertainmentCategory?.name == name
      : (entertainmentCategory.name = entertainmentCategory?.name);
    await entertainmentCategory.save();
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

const deleteEntertainmentCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    await EntertainmentCategory.findByIdAndDelete(id).exec();
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

const getAllEntertainmentCategory = async (req, res) => {
  try {
    const entertainmentCategory = await EntertainmentCategory.find().exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, entertainmentCategory);
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
  getAllEntertainmentCategory,
  deleteEntertainmentCategoryById,
  updateEntertainmentcategoryById,
  saveEntertainmentcategory,
  getEntertainmentCategoryById,
};
