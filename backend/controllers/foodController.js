const FoodItems = require("../models/foodItems");
const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require("../helpers/logging");
const NAMESPACE = "FOOD Controller";
const getAllFoodItems = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getAllFoodItems", "getAllFoodItems");
    const hotelId = req.params.hotelId;
    const items = await FoodItems.find({ hotelId: hotelId }).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, items);
    rs.msg = "Food items Fetched Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(
      NAMESPACE,
      "getAllFoodItems",
      "getAllFoodItems exception",
      ex
    );
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};
const saveFoodItem = async (req, res) => {
  try {
    logging.info(NAMESPACE, "saveFoodItem", "saveFoodItem called");
    const { name, price, hotelId, desc, category, image, veg } = req.body;
    const duplicate = await FoodItems.findOne({ name: name }).exec();
    if (duplicate) {
      return res.status(400).json({
        success: false,
        msg: "Item Already Exists",
      });
    }

    const food = new FoodItems({
      name,
      desc,
      category,
      price,
      hotelId,
      image,
      veg,
    });
    await food.save();
    var rs = new iResponse(HTTPCodes.SUCCESS, {});
    rs.msg = "Item Saved Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "saveFoodItem", "saveFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const EditFoodItem = async (req, res) => {
  try {
    logging.info(NAMESPACE, "EditFoodItem", "EditFoodItem called");
    const { id, name, price, hotelId, desc, category, image, veg } = req.body;
    if (name == "" || price === "" || hotelId === "" || image === "", veg === "") {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "Required fields are missing";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
    const food = await FoodItems.findById(id).exec();
    food.name = name;
    food.price = price;
    food.hotelId = hotelId;
    food.desc = desc;
    food.category = category;
    food.image = image;
    food.veg = veg;
    await food.save();
    var rs = new iResponse(HTTPCodes.SUCCESS, {});
    rs.msg = "Item Updated Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (error) {
    logging.error(NAMESPACE, "EditFoodItem", "EditFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const deleteFoodItem = async (req, res) => {
  try {
    logging.info(NAMESPACE, "deleteFoodItem", "deleteFoodItem called");
    const id = req.params.id;
    if (id) {
      const data = await FoodItems.findById(id).exec();
      if (!data) {
        var rs = new iResponse(HTTPCodes.NOTFOUND, {});
        rs.msg = "Item doesn't exists";
        return res.status(HTTPCodes.NOTFOUND.status).json(rs);
      }
    } else {
      var rs = new iResponse(HTTPCodes.SUCCESS, {});
      rs.msg = "Item Id is required";
      return res.status(HTTPCodes.SUCCESS.status).json(rs);
    }
    await FoodItems.findByIdAndDelete(id).exec();
    var rs = new iResponse(HTTPCodes.SUCCESS, {});
    rs.msg = "Item Updated Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "deleteFoodItem", "deleteFoodItem exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const getFoodItem = async (req, res) => {
  try {
    logging.error(NAMESPACE, "getFoodItem", "getFoodItem called");
    const id = req.params.id;
    const foodItem = await FoodItems.findById(id).exec();
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

module.exports = {
  getAllFoodItems,
  getFoodItem,
  deleteFoodItem,
  EditFoodItem,
  saveFoodItem,
};
