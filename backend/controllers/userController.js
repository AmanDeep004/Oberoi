const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require('../helpers/logging');
const Hotels = require('../models/hotel')
const FoodItem = require("../models/foodItem");
const FoodCategory = require("../models/foodCategory");
const NewFoodPackage = require("../models/foodPackageNew");
const DecorCategory = require("../models/decorCategory");
const DecorItem = require("../models/decorItem");
const EntertainmentCategory = require("../models/entertainmentCategory");
const EntertainmentItem = require("../models/entertainmentItem");
const UserRequirementNew = require("../models/userRequirementsNew");
const EmailsTemplates = require("../models/emailtemplate");
const sendMail = require('../helpers/mail');
const mongoose = require('mongoose');


const NAMESPACE = 'USER Controller';

const saveEmailTemplate = async (mailOptions, success) => {
    const emailTemplate = new EmailsTemplates({
        templateTitle: mailOptions.subject,
        subject: mailOptions.subject,
        emailContent: mailOptions.html || mailOptions.text,
        isActive: success,
        displayName: "Royal Orchid",
    });

    try {
        const savedTemplate = await emailTemplate.save();
        console.log('Email template saved:', savedTemplate);
        return savedTemplate;
    } catch (error) {
        console.error('Error saving email template:', error);
        throw error;
    }

};
/**to get all the hotels data */
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

/**to get hotel details by Id */
const GetHotelById = async (req, res) => {
    logging.info(NAMESPACE, 'GetHotelById', 'Getting Hotel Info', req.params.hotelId);
    var isNotFriendlyName = mongoose.Types.ObjectId.isValid(req.params.hotelId);
    var hotelInfo = isNotFriendlyName ? await Hotels.findById(req.params.hotelId).exec() : await Hotels.findOne({ friendlyName: req.params.hotelId }).exec();
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

/** to get the Hotels details by Name */
const GetHotelDetailsbyName = async (req, res) => {
    logging.info(NAMESPACE, 'GetHotelDetailsbyName', 'Getting Hotel Info by Hotel Url Name', req.params.hotelName);
    var hotelData = await Hotels.findOne({ urlName: req.params.hotelName })
    try {
        if (hotelData) {
            hotelData.src = `/Hotels/${req.params.hotelName}/index.htm`
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

/**to get all halls details */
const GetAllHalls = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'Get ALL Rooms', 'Get ALL Rooms', req.params.hotelId);
        var hotel = await Hotels.findById(req.params.hotelId).exec();
        var roomsData = hotel.roomInfo.filter(room => room.virtualSittingArrangement.enable === true);
        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, roomsData));
    } catch (error) {
        logging.error(NAMESPACE, 'Get ALL Rooms', error.message);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the food category */
const GetAllFoodCategory = async (req, res) => {
    try {
        const foodCategory = await FoodCategory.find().exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, foodCategory);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "getAllFoodCategory", "getAllFoodCategory exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};
/**to get the food category by its id */
const getFoodCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        const foodCategory = await FoodCategory.findById(id).exec();
        if (!foodCategory) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Item doesn't exists";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, foodCategory);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "getFoodCategoryById",
            "getFoodCategoryById exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the food item by category */
const getFoodItemByCategory = async (req, res) => {
    try {
        const { hotelId, categoryId } = req.params;
        if (!categoryId || !hotelId) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        const foodItems = await FoodItem.find({
            $and: [{ categoryId: req.params.categoryId }, { hotelId: req.params.hotelId }],
        }).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, foodItems);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "getFoodItemByCategory", "getFoodItemByCategory exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/** to get the food package by hotel Id */
const getFoodpackageByHotelId = async (req, res) => {
    try {
        const { hotelId } = req.params;
        if (!hotelId) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        const foodPackage = await NewFoodPackage.find({ hotelId: hotelId })
            .populate({
                path: "foodCategories.categoryId",
                model: "NewFoodCategory",
                select: "name", // Specify the fields you want to select from the Category model
            })
            .exec();
        if (!foodPackage) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Item doesn't exists";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, foodPackage);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "getFoodpackageByHotelId", "getFoodpackageByHotelId exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the food package by Id */
const getFoodPackageById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        const foodPackage = await NewFoodPackage.findById(id)
            .populate({
                path: "foodCategories.categoryId",
                model: "NewFoodCategory",
                select: "name", // Specify the fields you want to select from the Category model
            })
            .exec();
        if (!foodPackage) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Item doesn't exists";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, foodPackage);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "getFoodPackageById", "getFoodPackageById exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/** to get the food iten by hotel Id*/
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
        logging.error(NAMESPACE, "getFoodItemByHotelId", "getFoodItemByHotelId exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the food item by id */
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
        logging.error(NAMESPACE, "getFoodItemById", "getFoodItemById exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get all decor category */
const getAllDecorCategory = async (req, res) => {
    try {
        const decorCategory = await DecorCategory.find().exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, decorCategory);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "getAllDecorCategory", "getAllDecorCategory exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the decor category by id */
const getDecorCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        const decorCategory = await DecorCategory.findById(id).exec();
        if (!decorCategory) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Item doesn't exists";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, decorCategory);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "getDecorCategoryById", "getDecorCategoryById exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the decor item by hotelId */
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
            "getDecorItemByHotelId",
            "getDecorItemByHotelId exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get decor item by id  */
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
        logging.error(NAMESPACE, "getDecorItemById", "getDecorItemById exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the decor item by category and hotelId */
const getDecorItemByCategory = async (req, res) => {
    try {
        const { hotelId, categoryId } = req.params;
        if (!id || !hotelId) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        const decorItems = await DecorItem.find({
            $and: [{ categoryId: categoryId }, { hotelId: hotelId }],
        }).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, decorItems);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "getDecorItemByCategory",
            "getDecorItemByCategory exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the entertainment category */
const getAllEntertainmentCategory = async (req, res) => {
    try {
        const entertainmentCategory = await EntertainmentCategory.find().exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, entertainmentCategory);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "getAllEntertainmentCategory",
            "getAllEntertainmentCategory exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the entertainment category by id */
const getEntertainmentCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        const entertainmentCategory = await EntertainmentCategory.findById(id).exec();
        if (!entertainmentCategory) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Item doesn't exists";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, entertainmentCategory);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "getEntertainmentCategoryById",
            "getEntertainmentCategoryById exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the entertainment items */
const getEntertainmentItemByHotelId = async (req, res) => {
    try {
        const { hotelId } = req.params;
        if (!hotelId) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        const EntertainmentItems = await EntertainmentItem.find({ hotelId: hotelId }).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, EntertainmentItems);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "getEntertainmentItemByHotelId",
            "getEntertainmentItemByHotelId exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the entertainment by id */
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
        logging.error(NAMESPACE, "getEntertainmentItemById", "getEntertainmentItemById exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the entertainment item by hotelid and category */
const getEntertainmentItemByCategory = async (req, res) => {
    try {
        const { hotelId, categoryId } = req.params;
        if (!categoryId || !hotelId) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        const EntertainmentItems = await EntertainmentItem.find({
            $and: [{ categoryId: categoryId }, { hotelId: hotelId }],
        }).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, EntertainmentItems);
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "getEntertainmentItemByCategory",
            "getEntertainmentItemByCategory exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};


// HERE
/**to save the user Requirement */
const saveUserRequiremnetNew = async (req, res) => {
    try {
        logging.info(NAMESPACE, "User Requirement", "saveUserRequiremnetNew");
        console.log("UserReq", req.UserInfo);
        var userRequireData = new UserRequirementNew({
            hotelId: req.params.hotelId,
            event: req.body.event,
            isWedding: req.body.isWedding,
            other: req.body.other,
            community: req.body.community,
            programs: req.body.programs,
            eventType: req.body.eventType,
            stDate: req.body.stDate,
            enDate: req.body.enDate,
            guest: req.body.guest,
            sitArrangement: req.body.sitArrangement,
            venue: req.body.venue,
            isAlaCarte: req.body.isAlaCarte,
            compositionName: req.body.compositionName,
            isDrinks: req.body.isDrinks,
            isCustomMenu: req.body.isCustomMenu,
            isCustomDecor: req.body.isCustomDecor,
            isCustomEntertainment: req.body.isCustomEntertainment,
            userId: req.body.userId,
            composition: req.body.composition,
            entertainmentComposition: req.body.entertainmentComposition,
            decorComposition: req.body.decorComposition,
            isAssociateProgramFood: req.body.isAssociateProgramFood
        })
        var data = await userRequireData.save();
        let userReqData = await UserRequirementNew.findById(data?._id).populate({
            path: "hotelId",
            select: ["hotelName"],
            model: Hotels,
        }).populate("decorComposition")
            .populate("entertainmentComposition").populate("composition")
            .exec();
        console.log(userReqData, "amannn...")

        const generateEmailContent = (data) => {

            const formatArray = (array) => {
                if (array.length === 0) return null;
                return array.map(item => (item?.name || item?.value || 'n/a').toLowerCase()).join(', ');
            };
            const fields = [
                { label: 'Event', value: data.event?.toLowerCase() || 'n/a' },
                { label: 'Wedding', value: data.isWedding !== undefined ? (data.isWedding ? 'yes' : 'no') : 'n/a' },
                { label: 'Other', value: data.other?.toLowerCase() || 'n/a' },
                { label: 'Community', value: data.community?.toLowerCase() || 'n/a' },
                { label: 'Programs', value: formatArray(data.programs) },
                { label: 'Event Type', value: data.eventType?.toLowerCase() || 'n/a' },
                { label: 'Start Date', value: data.stDate?.toLowerCase() || 'n/a' },
                { label: 'End Date', value: data.enDate?.toLowerCase() || 'n/a' },
                { label: 'Guest', value: data.guest?.toLowerCase() || 'n/a' },
                { label: 'Sitting Arrangement', value: data.sitArrangement?.toLowerCase() || 'n/a' },
                { label: 'Venue', value: data.venue?.toLowerCase() || 'n/a' },
                { label: 'Ala Carte', value: data.isAlaCarte !== undefined ? (data.isAlaCarte ? 'yes' : 'no') : 'n/a' },
                { label: 'Composition Name', value: data.compositionName?.toLowerCase() || 'n/a' },
                { label: 'Drinks', value: data.isDrinks !== undefined ? (data.isDrinks ? 'yes' : 'no') : 'n/a' },
                { label: 'Custom Menu', value: data.isCustomMenu !== undefined ? (data.isCustomMenu ? 'yes' : 'no') : 'n/a' },
                { label: 'Custom Decor', value: data.isCustomDecor !== undefined ? (data.isCustomDecor ? 'yes' : 'no') : 'n/a' },
                { label: 'Custom Entertainment', value: data.isCustomEntertainment !== undefined ? (data.isCustomEntertainment ? 'yes' : 'no') : 'n/a' },
                { label: 'Associate Program Food', value: data.isAssociateProgramFood !== undefined ? (data.isAssociateProgramFood ? 'yes' : 'no') : 'n/a' },
                { label: 'Composition', value: formatArray(data.composition) },
                { label: 'Decor Composition', value: formatArray(data.decorComposition) },
                { label: 'Entertainment Composition', value: formatArray(data.entertainmentComposition) },
            ];

            return `
        <ul>
            ${fields.filter(field => field.value !== null && field.value !== '').map(field => `<li>${field.label}: ${field.value}</li>`).join('')}
        </ul>
    `;
        };

        const hotel = await Hotels.findById(req.params?.hotelId);
        console.log(hotel, "hotelData..")
        console.log(hotel?.contactInfo?.banquet?.email, "banemail")
        if (!hotel) {
            throw new Error('Hotel not found');
        }
        // console.log("hotelId..", (hotel?._id).toString());
        const hotelId = hotel?._id.toString();
        const hotelEmailOptions = {
            // from: `"Vosmos" <${process.env.SMTP_USER}>`,
            to: hotel?.contactInfo?.banquet?.email,
            subject: 'Vosmos - New Banquet Inquiry - Proposal Preparation Required',
            html: `
        <html>
            <body>
                <p>Dear Banquet team,</p>
                <p>We have received a new inquiry for a banquet hall booking from ${req?.UserInfo?.name}. Please find the details of the request below:</p>
                 <h3>User Details:</h3>
        <ul>
            <li>Name: ${req?.UserInfo?.name}</li>
            <li>Email: ${req?.UserInfo?.email}</li>
            <li>Mobile: ${req?.UserInfo?.mobile}</li>
        </ul>
          <h3>Requirement Details:</h3>
                   ${generateEmailContent(userReqData)}
                <p>Please prepare a detailed proposal based on the customer's requirements and respond at your earliest convenience. Ensure that the proposal aligns with our standards and meets the customer's expectations.</p>
                <p>Once the proposal is ready, please send it to ${req?.UserInfo?.email} and update the same on Vosmos Dashboard for our records.</p>
                <p>Thank you for your prompt attention to this matter.</p>
                <p>Best regards,<br>Vosmos Venue Visualizer</p>
            </body>
        </html>
    `
        };

        const userEmailOptions = {
            // from: `"Royal Orchid" <${process.env.SMTP_USER}>`,
            to: req?.UserInfo?.email,
            subject: `Thank You for Your Inquiry with ${hotel?.hotelName}`,
            text: 'Thank you for submitting your requirement.',
            html: `
        <html>
            <body>
                <p>Dear ${req?.UserInfo?.name},</p>
                <p>Thank you for considering ${hotel?.hotelName} for your upcoming event. We have received your request for the event and appreciate the opportunity to serve you.</p>
                <p>Our team is currently reviewing the details of your event. We will prepare a detailed proposal based on your requirements and get back to you as soon as possible.</p>
                <p>Should you have any additional information or specific requests, please feel free to contact us at <a href="mailto:${hotel?.contactInfo?.banquet?.email || hotel?.reservationEmail || hotel?.contactInfo?.room?.email}">${hotel?.contactInfo?.banquet?.email || hotel?.reservationEmail || hotel?.contactInfo?.room?.email}</a>.</p>
                <p>Thank you once again for choosing ${hotel?.hotelName}. We look forward to making your event a memorable one.</p>
                <p>Best regards,</p>
                <p>Royal Orchid Hotels</p>
                <p><a href="https://www.royalorchidhotels.com/">https://www.royalorchidhotels.com/</a></p>
            </body>
        </html>
    `
        };

        await sendMail(hotelEmailOptions, hotelId);
        await sendMail(userEmailOptions, hotelId);

        await saveEmailTemplate(hotelEmailOptions);
        await saveEmailTemplate(userEmailOptions);


        var rs = new iResponse(HTTPCodes.SUCCESS, data);
        rs.msg = "Requirement saved";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    }
    catch (ex) {
        logging.error(NAMESPACE, "User Requirement", "saveUserRequiremnetNew  Exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};


module.exports = {
    GetAllHotels, GetHotelById, GetHotelDetailsbyName, GetAllHalls,
    GetAllFoodCategory, getFoodCategoryById,
    getFoodpackageByHotelId, getFoodPackageById,
    getFoodItemByHotelId, getFoodItemById, getFoodItemByCategory,
    getAllDecorCategory, getDecorCategoryById,
    getDecorItemByHotelId, getDecorItemById, getDecorItemByCategory,
    getAllEntertainmentCategory, getEntertainmentCategoryById,
    getEntertainmentItemByHotelId, getEntertainmentItemById, getEntertainmentItemByCategory,
    saveUserRequiremnetNew,
}