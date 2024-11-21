const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require("../helpers/logging");
const NAMESPACE = "FOOD Controller";

const EntertainmentItem = require("../models/entertainmentItem");
const EntertainmentCategory = require("../models/entertainmentCategory");

const getEntertainmentItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const entertainmentItem = await EntertainmentItem.findById(id).exec();
    if (!entertainmentItem) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Item doesn't exists";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    var rs = new iResponse(HTTPCodes.SUCCESS, entertainmentItem);
    rs.msg = "Item found Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "getFoodItem", "getFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const getEntertainmentItemByCategory = async (req, res) => {
  try {
    const { hotelId, id } = req.body;
    if (!id || !hotelId) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const EntertainmentItems = await EntertainmentItem.find({
      $and: [{ categoryId: id }, { hotelId: hotelId }],
    }).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, EntertainmentItems);
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

const getEntertainmentItemByHotelId = async (req, res) => {
  try {
    const { hotelId } = req.params;
    if (!hotelId) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const EntertainmentItems = await EntertainmentItem.find({
      hotelId: hotelId,
    }).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, EntertainmentItems);
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

const updateEntertainmentItemById = async (req, res) => {
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
      duration,
      lang,
    } = req.body;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const entertainmentItem = EntertainmentItem.findById(id).exec();
    if (!entertainmentItem) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Item doesn't exists";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }

    const entertainmentCategory = await EntertainmentCategory.findById(
      categoryId
    ).exec();
    if (!entertainmentCategory) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "foodCategory is not found";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }

    name
      ? (entertainmentItem.name = name)
      : (entertainmentItem.name = entertainmentItem?.name);
    price
      ? (entertainmentItem.price = price)
      : (entertainmentItem.price = entertainmentItem?.price);
    desc
      ? (entertainmentItem.desc = desc)
      : (entertainmentItem.desc = entertainmentItem?.desc);
    categoryId
      ? (entertainmentItem.categoryId = categoryId)
      : (entertainmentItem.categoryId = entertainmentItem?.categoryId);
    image
      ? (entertainmentItem.image = image)
      : (entertainmentItem.image = entertainmentItem?.image);
    tagName
      ? (entertainmentItem.tagName = tagName)
      : (entertainmentItem.tagName = entertainmentItem?.tagName);
    images
      ? (entertainmentItem.images = images)
      : (entertainmentItem.images = entertainmentItem?.images);
    videos
      ? (entertainmentItem.videos = videos)
      : (entertainmentItem.videos = entertainmentItem?.videos);
    duration
      ? (entertainmentItem.duration = duration)
      : (entertainmentItem.duration = entertainmentItem?.duration);
    lang
      ? (entertainmentItem.lang = lang)
      : (entertainmentItem.lang = entertainmentItem?.lang);
    await entertainmentItem.save();
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

const saveEntertainmentItemById = async (req, res) => {
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
      duration,
      lang,
    } = req.body;
    if (
      !name ||
      !price ||
      !desc ||
      !categoryId ||
      !hotelId ||
      !tagName ||
      !images ||
      !videos ||
      !duration || 
      !lang
    ) {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "Required fields are missing";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
    const decorCategory = await EntertainmentCategory.findById(
      categoryId
    ).exec();
    if (!decorCategory) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "decorCategory is not found";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const decor = new EntertainmentItem({
      name,
      price,
      desc,
      categoryId,
      image,
      hotelId,
      tagName,
      images,
      videos,
      duration,
      lang
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

const deleteEntertainmentItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    await EntertainmentItem.findByIdAndDelete(id).exec();
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
  deleteEntertainmentItemById,
  saveEntertainmentItemById,
  updateEntertainmentItemById,
  getEntertainmentItemByHotelId,
  getEntertainmentItemByCategory,
  getEntertainmentItemById,
};
