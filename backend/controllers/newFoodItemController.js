const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require("../helpers/logging");
const NAMESPACE = "FOOD Controller";
const FoodItem = require("../models/foodItem");
const FoodCategory = require("../models/foodCategory");
const getFoodItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const foodItem = await FoodItem.findById(id).exec();
    if (!foodItem) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Item doesn't exists";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    var rs = new iResponse(HTTPCodes.SUCCESS, foodItem);
    rs.msg = "Item found Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "getFoodItem", "getFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const getFoodItemByCategory = async (req, res) => {
  try {
    const { hotelId, id } = req.body;
    if (!id || !hotelId) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const foodItems = await FoodItem.find({
      $and: [{ categoryId: id }, { hotelId: hotelId }],
    }).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, foodItems);
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

const getFoodItemByHotelId = async (req, res) => {
  try {
    const { hotelId } = req.params;
    if (!hotelId) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const foodItems = await FoodItem.find({ hotelId: hotelId }).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, foodItems);
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

const updateFoodItemById = async (req, res) => {
  try {
    const { id, name, price, desc, categoryId, image } = req.body;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const foodItem = FoodItem.findById(id).exec();
    if (!foodItem) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Item doesn't exists";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }

    const foodCategory = await FoodCategory.findById(categoryId).exec();
    if (!foodCategory) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "foodCategory is not found";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }

    name ? (foodItem.name = name) : (foodItem.name = foodItem.name);
    price ? (foodItem.price = price) : (foodItem.price = foodItem.price);
    desc ? (foodItem.desc = desc) : (foodItem.desc = foodItem.desc);
    categoryId
      ? (foodItem.categoryId = categoryId)
      : (foodItem.categoryId = foodItem.categoryId);
    image ? (foodItem.image = image) : (foodItem.image = foodItem.image);

    await foodItem.save();
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

const saveFoodItemById = async (req, res) => {
  try {
    const { name, price, desc, categoryId, image, hotelId } = req.body;
    if (!name || !price || !desc || !categoryId || !hotelId) {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "Required fields are missing";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
    const foodCategory = await FoodCategory.findById(categoryId).exec();
    if (!foodCategory) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "foodCategory is not found";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    const food = new FoodItem({
      name,
      price,
      desc,
      categoryId,
      image,
      hotelId,
    });

    await food.save();
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

const deleteFoodItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Id is required";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    await FoodItem.findByIdAndDelete(id).exec();
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
  getFoodItemById,
  updateFoodItemById,
  saveFoodItemById,
  deleteFoodItemById,
  getFoodItemByCategory,
  getFoodItemByHotelId
};
