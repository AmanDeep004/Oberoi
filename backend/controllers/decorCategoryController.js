const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require("../helpers/logging");
const NAMESPACE = "FOOD Controller";
const DecorCategory = require("../models/decorCategory");


const getDecorCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const decorCategory = await DecorCategory.findById(id).exec();
    if (!decorCategory) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Item doesn't exists";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    var rs = new iResponse(HTTPCodes.SUCCESS, decorCategory);
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

const saveDecorcategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "All Fields are required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const decorCategory = new DecorCategory({
      name,
    });
    await decorCategory.save();
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

const updateDecorcategoryById = async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "All Fields are required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const decorCategory = await DecorCategory.findById(id).exec();
    name
      ? decorCategory?.name == name
      : (decorCategory.name = decorCategory?.name);
    await decorCategory.save();
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

const deleteDecorCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    await DecorCategory.findByIdAndDelete(id).exec();
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

const getAllDecorCategory = async (req, res) => {
  try {
    const decorCategory = await DecorCategory.find().exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, decorCategory);
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
    getAllDecorCategory,
    deleteDecorCategoryById,
    updateDecorcategoryById,
    saveDecorcategory,
    getDecorCategoryById
};
