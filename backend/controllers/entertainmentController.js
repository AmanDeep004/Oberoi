const Entertainment = require('../models/entertainment');
const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require('../helpers/logging');
const NAMESPACE = 'Entrance Controller';

const getAllEntertainment = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'getAllentertainments', 'getAllentertainments');
        const hotelId = req.params.hotelId;
        const items = await Entertainment.find({ hotelId: hotelId }).exec();
        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, items));
    } catch (ex) {
        logging.error(NAMESPACE, 'getAllentertainments', 'getAllentertainments exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};
const saveEntertainment = async (req, res) => {
    console.log('save ENTERTAINMENT')
    try {
        logging.info(NAMESPACE, 'saveEntertainment', 'saveEntertainment');
        const { name, price, hotelId, desc, imageUrl, category, duration, language } = req.body;
        const duplicate = await Entertainment?.findOne({ name: name }).exec();
        if (duplicate) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Entertainment Already Exists";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        const enter = new Entertainment({
            name,
            price,
            desc,
            hotelId,
            imageUrl,
            category,
            duration,
            language,
        });
        await enter.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Entertainment Saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'saveEntertainment', 'saveEntertainment exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const editEntertainment = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'editEntertainment', 'editEntertainment called');
        const { id, name, price, hotelId, desc, imageUrl, category, duration, language } = req.body;
        if (name == "" || price === "" || hotelId === "" || imageUrl === '') {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Required fields are missing"
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        const enter = await Entertainment.findById(id).exec();
        enter.name = name;
        enter.price = price;
        enter.hotelId = hotelId;
        enter.desc = desc;
        enter.imageUrl = imageUrl;
        enter.category = category;
        enter.duration = duration;
        enter.language = language;
        await enter.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Entertainment Updated Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'editEntertainment', 'editEntertainment exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const deleteEntertainment = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'deleteEntertainment', 'deleteEntertainment called');
        const id = req.params.id;
        if (id) {
            const data = await Entertainment.findById(id).exec();
            if (!data) {
                var rs = new iResponse(HTTPCodes.NOTFOUND, {});
                rs.msg = "Entertainment doesn't exists"
                return res.status(HTTPCodes.NOTFOUND.status).json(rs);
            }
        } else {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Entertainment Id is required"
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        await Entertainment.findByIdAndDelete(id).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Entertainment Deleted Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'deleteEntertainment', 'deleteEntertainment exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const getEntertainmentById = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'getEntertainmentById', 'getEntertainmentById');
        const id = req.params.id;
        const entertainment = await Entertainment.findById(id).exec();
        if (!entertainment) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, entertainment);
            rs.msg = "Item doesn't exists";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, entertainment);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, 'getEntertainmentById', 'getEntertainmentById exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};


module.exports = {
    getAllEntertainment,
    saveEntertainment,
    editEntertainment,
    deleteEntertainment,
    getEntertainmentById
};