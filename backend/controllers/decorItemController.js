const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require("../helpers/logging");
const NAMESPACE = "FOOD Controller";
const DecorItem = require("../models/decorItem");
const DecorCategory = require("../models/decorCategory");

const getDecorItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const decorItem = await DecorItem.findById(id).exec();
    if (!decorItem) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Item doesn't exists";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    var rs = new iResponse(HTTPCodes.SUCCESS, decorItem);
    rs.msg = "Item found Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "getFoodItem", "getFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const getDecorItemByCategory = async (req, res) => {
  try {
    const { hotelId, id } = req.body;
    if (!id || !hotelId) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const decorItems = await DecorItem.find({
      $and: [{ categoryId: id }, { hotelId: hotelId }],
    }).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, decorItems);
    rs.msg = "Item found Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(
      NAMESPACE,
      "getFoodItemByCategory",
      "getFoodItemByCategory exception",
      ex
    );
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const getDecorItemByHotelId = async (req, res) => {
  try {
    const { hotelId } = req.params;
    if (!hotelId) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const decorItems = await DecorItem.find({ hotelId: hotelId }).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, decorItems);
    rs.msg = "Item found Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(
      NAMESPACE,
      "getFoodItemByCategory",
      "getFoodItemByCategory exception",
      ex
    );
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const updateDecorItemById = async (req, res) => {
  try {
    const {
      id,
      name,
      price,
      desc,
      categoryId,
      image,
      tagName,
      images,
      videos,
    } = req.body;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const decorItem = DecorItem.findById(id).exec();
    if (!decorItem) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Item doesn't exists";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }

    const decorCategory = await DecorCategory.findById(categoryId).exec();
    if (!decorCategory) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "foodCategory is not found";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }

    name ? (decorItem.name = name) : (decorItem.name = decorItem.name);
    price ? (decorItem.price = price) : (decorItem.price = decorItem.price);
    desc ? (decorItem.desc = desc) : (decorItem.desc = decorItem.desc);
    categoryId
      ? (decorItem.categoryId = categoryId)
      : (decorItem.categoryId = decorItem.categoryId);
    image ? (decorItem.image = image) : (decorItem.image = decorItem.image);
    tagName
      ? (decorItem.tagName = tagName)
      : (decorItem.tagName = decorItem.tagName);
    images
      ? (decorItem.images = images)
      : (decorItem.images = decorItem.images);
    videos
      ? (decorItem.videos = videos)
      : (decorItem.videos = decorItem.videos);
    await decorItem.save();
    var rs = new iResponse(HTTPCodes.SUCCESS, {});
    rs.msg = "Item Updated Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "getFoodItem", "getFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const saveDecorItemById = async (req, res) => {
  try {
    const {
      name,
      price,
      desc,
      categoryId,
      image,
      hotelId,
      tagName,
      images,
      videos,
    } = req.body;
    if (
      !name ||
      !price ||
      !desc ||
      !categoryId ||
      !hotelId ||
      !tagName ||
      !images ||
      !videos
    ) {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "Required fields are missing";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
    const decorCategory = await DecorCategory.findById(categoryId).exec();
    if (!decorCategory) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "decorCategory is not found";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const decor = new DecorItem({
      name,
      price,
      desc,
      categoryId,
      image,
      hotelId,
      tagName,
      images,
      videos,
    });

    await decor.save();
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

const deleteDecorItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    await DecorItem.findByIdAndDelete(id).exec();
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
  deleteDecorItemById,
  saveDecorItemById,
  updateDecorItemById,
  getDecorItemByHotelId,
  getDecorItemByCategory,
  getDecorItemById,
};
