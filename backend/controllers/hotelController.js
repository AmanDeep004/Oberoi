const Hotels = require('../models/hotel')
const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require('../helpers/logging');
const NAMESPACE = 'Hotel Controller';

const GetAllHotels = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllHotels', 'Getting All Hotel Info');
    try {
        const allHotels = await Hotels.find().exec();
        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, allHotels));
    } catch (error) {
        logging.error(NAMESPACE, 'GetAllHotels', 'GetAllHotels exception', error);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const AddHotel = async (req, res) => {
    logging.info(NAMESPACE, 'AddHotel', 'Add Hotel Modal');
    res.render('addHotel', { layout: false });
};

const UpdateHotelInfo = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateHotelInfo', 'Updating Hotel Info', req.body);
    var hotelInfo = await Hotels.findById(req.body.hotelId).exec();
    hotelInfo.hotelName = req.body.hotelName;
    hotelInfo.address = req.body.address;
    hotelInfo.location = req.body.location;
    // hotelInfo.reservationEmail = req.body.reservationEmail;
    // hotelInfo.banquetEmail = req.body.banquetEmail;
    // hotelInfo.contactNo = req.body.contactNo;
    // hotelInfo.reservationNo = req.body.reservationNo;
    hotelInfo.imageUrl = req.body.imageUrl;
    hotelInfo.contactInfo = req.body.contactInfo;
    hotelInfo.urlName = req.body.urlName;

    await Hotels.findByIdAndUpdate(req.body.hotelId, { $set: hotelInfo })
        .then(async (result) => {
            logging.error(NAMESPACE, 'UpdateHotelInfo', 'Hotel details updated successfully', result);
            req.session.sideMenu = await Hotels.find().exec();
            return res.status(200).json({
                success: true,
                redirect: true,
                url: `/admin/hotels/${req.body.hotelId}`,
                msg: 'Hotel details updated successfully!'
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, 'UpdateHotelInfo', 'Error while updating', error);
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = error.message;
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        });
};
const EditHotelInfo = async (req, res) => {
    logging.info(NAMESPACE, 'EditHotelInfo', 'Getting Hotel Info', req.params.hotelId);
    var hotelInfo = await Hotels.findById(req.params.hotelId).exec();
    console.log(hotelInfo);
    // res.render('editHotel', { layout: false, hotelInfo: hotelInfo });
    try {
        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, hotelInfo));
    } catch (error) {
        logging.error(NAMESPACE, 'EditHotelInfo', error.message);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const SaveHotel = async (req, res) => {
    logging.info(NAMESPACE, 'SaveHotel', 'Saving Hotel Details', req.body);

    let hotel = new Hotels({
        hotelName: req.body.hotelName,
        urlName: req.body.urlName,
        imageUrl: req.body.imageUrl,
        location: req.body.location,
        address: req.body.address,
        roomInfo: [],
        contactInfo: {
            restaurant: {
                email: req.body.contactInfo.restaurant.email,
                contactNo: req.body.contactInfo.restaurant.contactNo
            },
            room: {
                email: req.body.contactInfo.room.email,
                contactNo: req.body.contactInfo.room.contactNo
            },
            banquet: {
                email: req.body.contactInfo.banquet.email,
                contactNo: req.body.contactInfo.banquet.contactNo
            }
        }
        // src:
    });

    await hotel
        .save()
        .then(async (result) => {
            logging.info(NAMESPACE, 'SaveHotel', 'Hotel details saved successfully', result);
            req.session.sideMenu = await Hotels.find().exec();
            return res.status(200).json({
                success: true,
                redirect: true,
                url: '/admin/allHotels',
                msg: 'Hotel details saved successfully!'
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, 'SaveHotel', 'Error while saving', error);
            return res.status(400).json({
                success: false,
                msg: error._message
            });
        });
};

const DeleteHotelById = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteHotelById', 'Deleting Hotel by Id', req.params.hotelId);

    let result = await Hotels.findByIdAndDelete(req.params.hotelId)
        .exec()
        .catch((error) => {
            logging.error(NAMESPACE, 'DeleteHotelById', 'Error while Deleting', error);
            return res.status(400).json({
                success: false,
                msg: error._message
            });
        });

    if (result) {
        logging.info(NAMESPACE, 'DeleteHotelById', 'Hotel Deleted successfully', result);
        req.session.sideMenu = await Hotels.find().exec();
        return res.status(200).json({
            success: true,
            redirect: true,
            url: '/admin/allHotels',
            msg: 'Hotel Deleted successfully!'
        });
    }
};



const GetHotelById = async (req, res) => {
    logging.info(NAMESPACE, 'GetHotelById', 'Getting Hotel Info', req.params.hotelId);
    var hotelInfo = await Hotels.findById(req.params.hotelId).exec();
    try {
        var rs = new iResponse(HTTPCodes.SUCCESS, hotelInfo);
        rs.msg = "Hotels Data";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    }
    catch (error) {
        logging.error(NAMESPACE, 'GetHotelById', 'GetHotelById exception', error);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};


const GetHotelDetailsbyName = async (req, res) => {
    logging.info(NAMESPACE, 'GetHotelDetailsbyName', 'Getting Hotel Info by Hotel Url Name', req.params.hotelName);
    // var hotelNameData = await HotelNames.findOne({ urlName: req.params.urlName })
    var hotelData = await Hotels.findOne({ urlName: req.params.hotelName })
    try {
        if (hotelData) {
            hotelData.src = `/Hotels/${req.params.hotelName}/index.htm`
            // console.log(hotelInfo.src, "updated url")
        }
        return res.status(200).json({
            hotelData: hotelData,
            success: true
        });
    }
    catch (error) {
        logging.error(NAMESPACE, 'GetHotelDetailsbyName', 'GetHotelDetailsbyName exception', error);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const AddHotelDetailsbyName = async (req, res) => {
    logging.info(NAMESPACE, 'AddHotelDetailsbyName', 'Get all hotels id by hotel name', req.body);
    let hotelName = new HotelNames({
        hotelName: req.body.hotelName,
        hotelId: req.body.hotelId
    });
    await hotelName.save().then(async (result) => {
        logging.info(NAMESPACE, 'AddHotelDetailsbyName', 'Hotel name added', result);
        req.session.sideMenu = await HotelNames.find().exec();
        return res.status(200).json({
            success: true,
            msg: 'Hotel details saved successfully!'
        })
    }).catch((error) => {
        logging.error(NAMESPACE, 'AddHotelDetailsbyName', 'Error while saving', error);
        return res.status(200).json({
            success: false,
            msg: error._message
        })
    })
}






module.exports = {
    AddHotel, SaveHotel, DeleteHotelById, GetAllHotels, GetHotelById, GetHotelDetailsbyName, AddHotelDetailsbyName,
    EditHotelInfo, UpdateHotelInfo

}