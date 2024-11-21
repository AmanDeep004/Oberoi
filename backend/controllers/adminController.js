const logging = require('../helpers/logging');
const Bookings = require('../models/bookings');
const Hotels = require('../models/hotel');
const Users = require('../models/user');
const HotelNames = require('../models/hotelmap')
const id = require('../helpers/constants');
const NAMESPACE = 'ADMIN Controller';
const { ObjectId } = require('mongodb');
const { check, validationResult } = require('express-validator');
const { HTTPCodes, iResponse } = require("../helpers/Common");
//** Route Handlers aka actionMethods */
const Home = async (req, res) => {
    logging.info(NAMESPACE, 'Home', 'Inside home');
    if (req.session.loggedInUser)
        return res.status(200).json({
            success: true,
            redirect: true,
            url: `/admin/dashboard`,
            msg: 'You are already Logged In!'

        })

    else return res.status(200).json({
        success: true,
        redirect: true,
        url: `/login`,
        msg: 'Login!'

    })
};

const Dashboard = async (req, res) => {
    logging.info(NAMESPACE, 'Dashboard', 'Inside Dashboard');
    var allHotels = await Hotels.find().exec();
    var allUsers = await Users.find({ roleId: { $ne: 1 } }).exec();
    var bookings = await Bookings.find({}).sort({ createdAt: -1 }).exec();
    res.render('dashboard', { hotels: allHotels, users: allUsers, bookings: bookings });
};


const GetAllUsers = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'GetAllUsers', 'Getting All users Info');
        var allUsers = await Users.find({}).exec();
        // var allUsers = await Users.find({ roleId: { $ne: 1 } }).exec();
        // console.log("===", allUsers.length)
        console.log(allUsers, "all users data")
        // var list = [];
        // allUsers.forEach((user) => {
        //     list.push({
        //         firstName: user.firstName,
        //         lastName: user.lastName,
        //         roleId: user.roleId == 2 ? 'Admin' : 'User',
        //         email: user.email,
        //         avatar: user.avatar,
        //         _id: user._id
        //     })
        // })
        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, allUsers));
    } catch (error) {
        logging.error(NAMESPACE, 'GetAllUsers', 'GetAllUsers exception', error.message);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const EditUserInfo = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'EditUsers', 'Editing users Info');
        let user = await Users.findById(req.params.userId).exec();
        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, user));
    } catch (error) {
        logging.error(NAMESPACE, 'EditUsers', 'EditUsers exception', error);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const UpdateUser = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateUsers', 'update users Info');
    var user = await Users.findById(req.body.userId).exec();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.avatar = req.body.avatar;
    user.roleId = req.body.roleId;
    user.hotelId = req.body.hotelId;

    await Users.findByIdAndUpdate(req.body.userId, { $set: user })
        .then(async (result) => {
            logging.error(NAMESPACE, 'SaveNewUser', 'user details saved successfully', result);
            return res.status(200).json({
                success: true,
                redirect: true,
                url: `/admin/allUsers`,
                msg: 'User details saved successfully!'
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, 'SaveNewUser', 'Error while saving', error);
            return res.status(200).json({
                success: false,
                msg: error._message
            });
        });


};

const AddUser = async (req, res) => {
    logging.info(NAMESPACE, 'AddUser', 'Add user Modal');
    res.render('addUser', { layout: false });
};

// save user
const SaveUser = async (req, res) => {
    logging.info(NAMESPACE, 'saveuser', 'save user Modal');
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        var alert = errors.array();
        console.log("alerts", alert);
        //var list = []
        // alert.forEach((error)=>{
        // 	console.log(error.msg)
        // 	list.push(error.msg)
        // })

        return res.status(200).json({
            success: false,
            msg: alert[0].msg,
        });
    }
    else {
        const { firstName, lastName, email, password, roleId, avatar, hotelId } = req.body;
        if (!firstName || !lastName || !email || !password || !roleId || !hotelId) {
            var rs = new iResponse(HTTPCodes.ERROR, {});
            rs.msg = "All Fields are required"
            return res.status(HTTPCodes.ERROR.status).json(rs);
        }
        let user = new Users({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            roleId: req.body.roleId,
            avatar: req.body.avatar,
            hotelId: req.body.hotelId
        })

        await user
            .save()
            .then(async (result) => {
                logging.info(NAMESPACE, 'SaveUser', 'user details saved successfully', result);
                console.log(result, 'result')
                return res.status(200).json({
                    success: true,
                    redirect: true,
                    url: '/admin/allUsers',
                    msg: 'user details saved successfully!',
                    id: result._id
                });
            })

            .catch((error) => {
                logging.error(NAMESPACE, 'SaveUser', 'Error while saving', error);
                if (error.code == 11000) {
                    return res.status(200).json({
                        success: false,
                        msg: "Email already exists"
                    });
                }
                else {
                    return res.status(200).json({
                        success: false,
                        msg: error._message
                    });
                }
            });
    }
};

const DeleteUserById = async (req, res) => {
    logging.info(NAMESPACE, 'delete user', 'delete user Modal');
    let result = await Users.findByIdAndDelete(req.params.userId)
        .exec()
        .catch((error) => {
            logging.error(NAMESPACE, 'DeleteUserById', 'Error while Deleting', error);
            return res.status(200).json({
                success: false,
                msg: error._message
            });
        });

    if (result) {
        logging.info(NAMESPACE, 'DeleteHotelById', 'user Deleted successfully', result);
        return res.status(200).json({
            success: true,
            redirect: true,
            url: '/admin/allUsers',
            msg: 'user deleted successfully!'
        });
    }


};



//rooms

const GetAllRooms = async (req, res) => {
    logging.info(NAMESPACE, 'Get ALL Rooms', 'Get ALL Rooms', req.params.hotelId);
    var hotel = await Hotels.findById(req.params.hotelId).exec();
    var roomsData = await hotel.roomInfo;
    console.log(roomsData, "hotelData")
    // res.render('addRoom', { layout: false, hotelId: req.params.hotelId });
    try {
        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, roomsData));
    } catch (error) {
        logging.error(NAMESPACE, 'Get ALL Rooms', error.message);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const SaveNewRoom = async (req, res) => {
    logging.info(NAMESPACE, 'SaveNewRoom', 'Saving Room Details', req.body);
    if (req.body.roomId.trim() == '') {
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = 'Room/Pano Id is required';
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
    if (req.body.roomName.trim() == '') {
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = 'Room/Pano name is required';
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
    let list = [];
    if (req.body.virtualSittingArrangement.enable && req.body.virtualSittingArrangement.data) {
        req.body.virtualSittingArrangement_categories.forEach((category) => {
            var data = {
                name: category,
                data: []
            };
            let objs = req.body.virtualSittingArrangement.data.filter((x) => x.category == category);
            // console.log("Objs", objs);
            var data1;
            req.body.virtualSittingArrangement_name.forEach((name) => {
                data1 = {
                    name: name,
                    seats: []
                }
                let names = objs.filter((x) => x.name == name);
                // console.log("Names", names);
                names.forEach((rec) => {
                    data1.seats.push({
                        panoId: rec.panoId,
                        name: rec.seats
                    });
                })
                data.data.push(data1);
            });
            list.push(data);
        })
    }
    var hotel = await Hotels.findById(req.body.hotelId).exec();
    let roomInfo = {
        roomId: req.body.roomId.trim(),
        roomName: req.body.roomName.trim(),
        bookAVenue: req.body.bookAVenue == true ? true : false,
        bookAMeeting: req.body.bookAMeeting == true ? true : false,
        menuPDF: {
            enable: req.body.menuPDF.enable == true ? true : false,
            images: req.body.menuPDF.images ? req.body.menuPDF.images : []
        },
        foodMenu: {
            enable: req.body.foodMenu.enable == true ? true : false,
            data: req.body.foodMenu.data.map(item => ({
                title: item.title ? item.title.trim() : "",
                imageUrl: item.imageUrl ? item.imageUrl.trim() : "",
            })),

        },
        entertainment: {
            enable: req.body.entertainment.enable == true ? true : false,
            data: req.body.foodMenu.data.map(item => ({
                title: item.title ? item.title.trim() : "",
                imageUrl: item.imageUrl ? item.imageUrl.trim() : "",
            })),
        },
        bookingLink: {
            enable: req.body.bookingLink.enable == true ? true : false,
            link: req.body.bookingLink.link.trim()
        },
        facilityDetailer: {
            enable: req.body.facilityDetailer.enable == true ? true : false,
            data: req.body.facilityDetailer.data
                ? {
                    imgEnable: req.body.facilityDetailer.data.imgEnable == true ? true : false,
                    imgUrl: req.body.facilityDetailer.data.imgUrl.trim(),
                    title: req.body.facilityDetailer.data.title.trim(),
                    body: req.body.facilityDetailer.data.body.trim()
                }
                : {}
        },
        dayNightToggle: {
            enable: req.body.dayNightToggle.enable == true ? true : false,
            data: req.body.dayNightToggle.data
                ? {
                    type: req.body.dayNightToggle.data.type.trim(),
                    dayPanoId: req.body.dayNightToggle.data.dayPanoId.trim(),
                    nightPanoId: req.body.dayNightToggle.data.nightPanoId.trim()
                }
                : {}
        },
        imageGallery: {
            enable: req.body.imageGallery.enable == true ? true : false,
            images: req.body.imageGallery.photos ? req.body.imageGallery.photos : []
        },
        virtualSittingArrangement: {
            enable: req.body.virtualSittingArrangement.enable == true ? true : false,
            data: list
        }
    };
    hotel.roomInfo.push(roomInfo);
    await Hotels.findByIdAndUpdate(req.body.hotelId, { $set: hotel })
        .then(async (result) => {
            logging.error(NAMESPACE, 'SaveNewRoom', 'Room details saved successfully', result);
            return res.status(200).json({
                success: true,
                redirect: true,
                url: `/admin/hotels/${req.body.hotelId}`,
                msg: 'Room details saved successfully!'
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, 'SaveNewRoom', 'Error while saving', error);
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = error.message;
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        });
};

const EditHotelRoom = async (req, res) => {
    logging.info(NAMESPACE, 'EditHotelRoom', 'Edit Hotel Room', req.params);
    let hotel = await Hotels.findById(req.params.hotelId).exec();
    let roomInfo = hotel.roomInfo[req.params.roomIndex];
    if (!roomInfo.menuPDF) {
        roomInfo.menuPDF = {
            enable: false,
            images: []
        }
        roomInfo.bookingLink = {
            enable: false,
            link: ''
        }
    }
    let virtualSittingArrangement = [];
    if (roomInfo.virtualSittingArrangement.data) {
        roomInfo.virtualSittingArrangement.data.forEach((obj) => {
            obj.data.forEach((ele) => {
                if (ele.seats) {
                    ele.seats.forEach((seat) => {
                        let data = {
                            category: obj.name,
                            name: ele.name,
                            seats: seat.name,
                            panoId: seat.panoId
                        };
                        virtualSittingArrangement.push(data);
                    })
                }
                else {
                    let data = {
                        category: obj.name,
                        name: ele.name,
                        seats: "",
                        panoId: ele.panoId
                    };
                    virtualSittingArrangement.push(data);
                }
            });
        });
    }
    roomInfo.virtualSittingArrangement.data = virtualSittingArrangement;
    // res.render('editRoom', { layout: false, hotelId: req.params.hotelId, roomIndex: req.params.roomIndex, roomInfo: roomInfo });
    try {
        return res.status(200).json({
            roomInfo: roomInfo,
            success: true
        });

    }
    catch (error) {
        logging.error(NAMESPACE, 'EditHotelRoom', error.message);
        return res.status(500).json({
            success: false,
            error: 'An error occurred while fetching room information.'
        });
    }
};

const UpdateHotelRoom = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateHotelRoom', 'Updating Room Details', req.body);

    if (req.body.roomId.trim() == '') {
        return res.status(200).json({
            success: false,
            msg: 'Room/Pano Id is required'
        });
    }
    if (req.body.roomName.trim() == '') {
        return res.status(200).json({
            success: false,
            msg: 'Room/Pano name is required'
        });
    }
    let list = [];
    if (req.body.virtualSittingArrangement.enable && req.body.virtualSittingArrangement.data) {
        req.body.virtualSittingArrangement_categories.forEach((category) => {
            var data = {
                name: category,
                data: []
            };
            let objs = req.body.virtualSittingArrangement.data.filter((x) => x.category == category);
            console.log("Objs", objs);
            var data1;
            req.body.virtualSittingArrangement_name.forEach((name) => {
                data1 = {
                    name: name,
                    seats: []
                }
                let names = objs.filter((x) => x.name == name);
                console.log("Names", names);
                names.forEach((rec) => {
                    data1.seats.push({
                        panoId: rec.panoId,
                        name: rec.seats
                    });
                })
                data.data.push(data1);
            });
            list.push(data);
        })
    }

    var hotel = await Hotels.findById(req.body.hotelId).exec();
    let roomInfo = {
        roomId: req.body.roomId.trim(),
        roomName: req.body.roomName.trim(),
        bookAVenue: req.body.bookAVenue == 'true' ? true : false,
        bookAMeeting: req.body.bookAMeeting == 'true' ? true : false,
        menuPDF: {
            enable: req.body.menuPDF.enable == 'true' ? true : false,
            images: req.body.menuPDF.images ? req.body.menuPDF.images : []
        },
        bookingLink: {
            enable: req.body.bookingLink.enable == 'true' ? true : false,
            link: req.body.bookingLink.link.trim()
        },
        facilityDetailer: {
            enable: req.body.facilityDetailer.enable == 'true' ? true : false,
            data: req.body.facilityDetailer.data
                ? {
                    imgEnable: req.body.facilityDetailer.data.imgEnable == 'true' ? true : false,
                    imgUrl: req.body.facilityDetailer.data.imgUrl.trim(),
                    title: req.body.facilityDetailer.data.title.trim(),
                    body: req.body.facilityDetailer.data.body.trim()
                }
                : {}
        },
        dayNightToggle: {
            enable: req.body.dayNightToggle.enable == 'true' ? true : false,
            data: req.body.dayNightToggle.data
                ? {
                    type: req.body.dayNightToggle.data.type.trim(),
                    dayPanoId: req.body.dayNightToggle.data.dayPanoId.trim(),
                    nightPanoId: req.body.dayNightToggle.data.nightPanoId.trim()
                }
                : {}
        },
        imageGallery: {
            enable: req.body.imageGallery.enable == 'true' ? true : false,
            images: req.body.imageGallery.photos ? req.body.imageGallery.photos : []
        },
        virtualSittingArrangement: {
            enable: req.body.virtualSittingArrangement.enable == 'true' ? true : false,
            data: list
        }
    };

    hotel.roomInfo[req.body.roomIndex] = roomInfo;

    await Hotels.findByIdAndUpdate(req.body.hotelId, { $set: hotel })
        .then(async (result) => {
            logging.error(NAMESPACE, 'UpdateHotelRoom', 'Room details updated successfully', result);
            return res.status(200).json({
                success: true,
                redirect: true,
                url: `/admin/hotels/${req.body.hotelId}`,
                msg: 'Room details updated successfully!'
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, 'UpdateHotelRoom', 'Error while saving', error);
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = error.message;
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        });
};

const DeleteHotelRoom = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteHotelRoom', 'Deleting Hotel Room', req.params);
    var hotelInfo = await Hotels.findById(req.params.hotelId).exec();
    hotelInfo.roomInfo.splice(req.params.roomIndex, 1);
    await Hotels.findByIdAndUpdate(req.params.hotelId, { $set: hotelInfo })
        .then(async (result) => {
            logging.error(NAMESPACE, 'DeleteHotelRoom', 'Hotel room deleted successfully', result);
            return res.status(200).json({
                success: true,
                redirect: true,
                url: `/admin/hotels/${req.params.hotelId}?#nav-rooms`,
                msg: 'Hotel room deleted successfully!'
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, 'DeleteHotelRoom', 'Error while deleting', error);
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = error.message;
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        });
};

const GetAllHalls = async (req, res) => {
    logging.info(NAMESPACE, 'Get ALL Rooms', 'Get ALL Rooms', req.params.hotelId);
    var hotel = await Hotels.findById(req.params.hotelId).exec();
    var roomsData = await hotel.roomInfo.filter(room => room.virtualSittingArrangement.enable === true);
    console.log(roomsData, "hotelData")
    // res.render('addRoom', { layout: false, hotelId: req.params.hotelId });
    try {
        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, roomsData));
    } catch (error) {
        logging.error(NAMESPACE, 'Get ALL Rooms', error.message);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};


const GetAllBookings = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllBookings', 'Getting Bookings');
    var bookings = await Bookings.find({}).sort({ createdAt: -1 }).exec();
    // res.render('bookings', { bookings: bookings });
    try {
        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, bookings));
    } catch (error) {
        logging.error(NAMESPACE, 'Bookings Data', error.message);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const DeleteBooking = async (req, res) => {
    const { id } = req.params;
    try {

        const booking = await Bookings.findById(id);

        if (!booking) {
            return res.status(HTTPCodes.NOTFOUND.status).json(new iResponse(HTTPCodes.NOTFOUND, null, 'Booking not found'));
        }

        // Delete the booking
        await booking.remove();

        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, null, 'Booking deleted successfully'));
    } catch (error) {
        logging.error(NAMESPACE, 'Delete Booking', error.message);
        const response = new iResponse(HTTPCodes.SERVERERROR, null, error.message);
        return res.status(HTTPCodes.SERVERERROR.status).json(response);
    }
};

module.exports = {
    Home,
    Dashboard,
    GetAllRooms,
    SaveNewRoom,
    EditHotelRoom,
    UpdateHotelRoom,
    DeleteHotelRoom,
    GetAllHalls,
    GetAllBookings,
    GetAllUsers,
    EditUserInfo,
    UpdateUser,
    AddUser,
    SaveUser,
    DeleteUserById,
    DeleteBooking
};


