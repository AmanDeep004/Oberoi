const FoodPackage = require('../models/foodPackage');
const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require('../helpers/logging');
const NAMESPACE = 'FOODPACKAGE Controller';
const getAllFoodPackages = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'getAllFoodPackages', 'getAllFoodPackages called');
        const hotelId = req.params.hotelId;
        const items = await FoodPackage.find({ hotelId: hotelId }).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, items);
        rs.msg = "Food items Fetched Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'getAllFoodPackages', 'getAllFoodPackages exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};
const saveFoodPackage = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'saveFoodPackage', 'saveFoodPackage called');
        const { name, price, hotelId, desc, foodItems,image } = req.body;
        const duplicate = await FoodPackage.findOne({ name: name }).exec();
        if (duplicate) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Item Already Exists";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        const food = new FoodPackage({
            name,
            price,
            desc,
            hotelId,
            foodItems,
            image
        });
        await food.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Item Saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'saveFoodPackage', 'saveFoodPackage exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const editFoodPackage = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'editFoodPackage', 'editFoodPackage called');
        const { id, name, price, hotelId, desc, foodItems,image } = req.body;
        if (name == "" || price === "" || hotelId === "" || foodItems === '' || image === "") {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Required fields are missing";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        const food = await FoodPackage.findById(id).exec();
        food.name = name;
        food.price = price;
        food.hotelId = hotelId;
        food.desc = desc;
        food.foodItems = foodItems;
        food.image = image
        await food.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Package Updated Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'editFoodPackage', 'editFoodPackage exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const deleteFoodPackage = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'deleteFoodPackage', 'deleteFoodPackage called');
        const id = req.params.id;
        if (id) {
            const data = await FoodPackage.findById(id).exec();
            if (!data) {
                var rs = new iResponse(HTTPCodes.BADREQUEST, {});
                rs.msg = "Package doesn't exists";
                return res.status(HTTPCodes.BADREQUEST.status).json(rs);
            }
        } else {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Package Id is required";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        await FoodPackage.findByIdAndDelete(id).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Item Updated Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'deleteFoodPackage', 'deleteFoodPackage exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const getFoodPackage = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'getFoodPackage', 'getFoodPackage called');
        const id = req.params.id;
        const foodItem = await FoodPackage.findById(id).exec();
        if (!foodItem) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Item doesn't exists";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, foodItem);
        rs.msg = "Item found Successfully"
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'getFoodPackage', 'getFoodPackage exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

module.exports = {
    getAllFoodPackages,
    saveFoodPackage,
    editFoodPackage,
    deleteFoodPackage,
    getFoodPackage
};
