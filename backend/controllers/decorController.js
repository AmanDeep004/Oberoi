const Decor = require('../models/decor');
const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require('../helpers/logging');
const NAMESPACE = 'DECOR Controller';
const getAlldecor = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'getAlldecor', 'getAlldecor');
        const hotelId = req.params.hotelId;
        const items = await Decor.find({ hotelId: hotelId }).exec();
        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, items));
    } catch (ex) {
        logging.error(NAMESPACE, 'getAlldecor', 'getAlldecor exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};
const saveDecor = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'saveDecor', 'saveDecor');
        const { name, price, hotelId, desc, imageUrl, category } = req.body;
        const duplicate = await Decor.findOne({ name: name }).exec();
        if (duplicate) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Decor Already Exists";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        const food = new Decor({
            name,
            price,
            desc,
            hotelId,
            category,
            imageUrl
        });
        await food.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Decor Saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'saveDecor', 'saveDecor exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const editDecor = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'editDecor', 'editDecor called');
        const { id, name, price, hotelId, desc, imageUrl, category } = req.body;
        if (name == "" || price === "" || hotelId === "" || imageUrl === '') {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Required fields are missing"
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        const food = await Decor.findById(id).exec();
        food.name = name;
        food.price = price;
        food.hotelId = hotelId;
        food.category = category;
        food.desc = desc;
        food.imageUrl = imageUrl;

        await food.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Decor Updated Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'editDecor', 'editDecor exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const deleteDecor = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'deleteDecor', 'deleteDecor called');
        const id = req.params.id;
        if (id) {
            const data = await Decor.findById(id).exec();
            if (!data) {
                var rs = new iResponse(HTTPCodes.NOTFOUND, {});
                rs.msg = "Decor doesn't exists"
                return res.status(HTTPCodes.NOTFOUND.status).json(rs);
            }
        } else {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Decor Id is required"
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        await Decor.findByIdAndDelete(id).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Decor Deleted Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'deleteDecor', 'deleteDecor exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const getDecorById = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'getDecorById', 'getDecorById');
        const id = req.params.id;
        const decor = await Decor.findById(id).exec();
        if (!decor) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, decor);
            rs.msg = "Item doesn't exists";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, decor);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'getDecorById', 'getDecorById exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

module.exports = {
    getAlldecor,
    saveDecor,
    editDecor,
    deleteDecor,
    getDecorById
};
