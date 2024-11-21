const Utm = require("../models/utm");
const Hotel = require("../models/hotel")
const logging = require("../helpers/logging");
const { HTTPCodes, iResponse } = require("../helpers/Common");
const NAMESPACE = "UTM Controller";

// Helper function to validate required fields
const validateUtmFields = (req, res) => {
    const { hotelName, isActive, utm } = req.body;
    if (!hotelName || isActive === undefined || !utm) {
        return {
            isValid: false,
            message: "Missing required fields:hotelName, isActive, and utm are required.",
        };
    }
    return { isValid: true };
};

// Create UTM
const createUtm = async (req, res) => {
    try {
        logging.info(NAMESPACE, "createUtm", "createUtm called");

        // Validate required fields
        const validation = validateUtmFields(req, res);
        if (!validation.isValid) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = validation.message;
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }

        const { userId, hotelName, hotelId, isActive, utm, generatedUrl } = req.body;

        const newUtm = new Utm({
            userId,
            hotelName,
            hotelId,
            isActive,
            utm,
            generatedUrl
        });

        const savedUtm = await newUtm.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, savedUtm);
        rs.msg = "UTM Created Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "createUtm", "createUtm exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

// Get All UTMs
const getAllUtms = async (req, res) => {
    try {
        logging.info(NAMESPACE, "getAllUtms", "getAllUtms called");
        const { adminData } = req;
        // console.log(adminData.roleId, "adminData_roleId")
        // console.log(adminData.hotelId, "adminData_hotelId")

        if (adminData.roleId == 1) {
            const utms = await Utm.find().exec();
            var rs = new iResponse(HTTPCodes.SUCCESS, utms);
            rs.msg = "UTMs Fetched Successfully";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        }
        else {
            const hotelData = await Hotel.findOne({ _id: adminData.hotelId })
            console.log(hotelData.friendlyName, "dataaa_hotel")
            const utms = await Utm.find({ hotelName: hotelData.friendlyName }).exec();
            var rs = new iResponse(HTTPCodes.SUCCESS, utms);
            rs.msg = "UTMs Fetched Successfully";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);

        }


    } catch (ex) {
        logging.error(NAMESPACE, "getAllUtms", "getAllUtms exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

// Get UTM by ID
const getUtmById = async (req, res) => {
    try {
        logging.info(NAMESPACE, "getUtmById", "getUtmById called");

        const { utmId } = req.params;
        const utm = await Utm.findById(utmId).exec();

        if (!utm) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "UTM Not Found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }

        var rs = new iResponse(HTTPCodes.SUCCESS, utm);
        rs.msg = "UTM Fetched Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "getUtmById", "getUtmById exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

// Update UTM by ID
// const updateUtm = async (req, res) => {
//     try {
//         logging.info(NAMESPACE, "updateUtm", "updateUtm called");

//         const validation = validateUtmFields(req, res);
//         if (!validation.isValid) {
//             var rs = new iResponse(HTTPCodes.BADREQUEST, {});
//             rs.msg = validation.message;
//             return res.status(HTTPCodes.BADREQUEST.status).json(rs);
//         }

//         const { utmId } = req.params;
//         const updateData = req.body;

//         const updatedUtm = await Utm.findByIdAndUpdate(utmId, updateData, {
//             new: true,
//             runValidators: true,
//         }).exec();

//         if (!updatedUtm) {
//             var rs = new iResponse(HTTPCodes.NOTFOUND, {});
//             rs.msg = "UTM Not Found";
//             return res.status(HTTPCodes.NOTFOUND.status).json(rs);
//         }

//         var rs = new iResponse(HTTPCodes.SUCCESS, updatedUtm);
//         rs.msg = "UTM Updated Successfully";
//         return res.status(HTTPCodes.SUCCESS.status).json(rs);
//     } catch (ex) {
//         logging.error(NAMESPACE, "updateUtm", "updateUtm exception", ex);
//         var rs = new iResponse(HTTPCodes.BADREQUEST, {});
//         rs.msg = ex.message;
//         return res.status(HTTPCodes.BADREQUEST.status).json(rs);
//     }
// };
const updateUtm = async (req, res) => {
    try {
        logging.info(NAMESPACE, "updateUtm", "updateUtm called");

        const validation = validateUtmFields(req, res);
        if (!validation.isValid) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = validation.message;
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }

        const { utmId } = req.params;
        const existingUtm = await Utm.findById(utmId).exec();
        if (!existingUtm) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "UTM Not Found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }

        const { userId, hotelName, hotelId, isActive, utm, generatedUrl } = req.body;

        existingUtm.userId = userId || existingUtm.userId;
        existingUtm.hotelName = hotelName || existingUtm.hotelName;
        existingUtm.hotelId = hotelId || existingUtm.hotelId;
        existingUtm.isActive = isActive !== undefined ? isActive : existingUtm.isActive;
        existingUtm.utm = utm || existingUtm.utm;
        existingUtm.generatedUrl = generatedUrl || existingUtm.generatedUrl;

        const updatedUtm = await existingUtm.save();

        var rs = new iResponse(HTTPCodes.SUCCESS, updatedUtm);
        rs.msg = "UTM Updated Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "updateUtm", "updateUtm exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};


// Delete UTM by ID
const deleteUtm = async (req, res) => {
    try {
        logging.info(NAMESPACE, "deleteUtm", "deleteUtm called");

        const { utmId } = req.params;

        const deletedUtm = await Utm.findByIdAndDelete(utmId).exec();

        if (!deletedUtm) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "UTM Not Found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }

        var rs = new iResponse(HTTPCodes.SUCCESS, deletedUtm);
        rs.msg = "UTM Deleted Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "deleteUtm", "deleteUtm exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

module.exports = {
    createUtm,
    getAllUtms,
    getUtmById,
    updateUtm,
    deleteUtm,
};
