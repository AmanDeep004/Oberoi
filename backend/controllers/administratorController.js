const logging = require("../helpers/logging");
const User = require("../models/user");
const Hotels = require("../models/hotel");
const { HTTPCodes, iResponse } = require("../helpers/Common");
const FoodCategory = require("../models/foodCategory");
const DecorCategory = require("../models/decorCategory");
const EntertainCategory = require("../models/entertainmentCategory");
const WeddCommunity = require("../models/weddingCommunity");
const FoodItems = require("../models/foodItem");
const DecorItems = require("../models/decorItem");
const EntertainmentItem = require("../models/entertainmentItem");
const EmailsTemplates = require("../models/emailtemplate");

const UserRequiremnet = require("../models/userRequirementsNew");
const BookingUser = require("../models/bookingUser");
const MailService = require("../helpers/mailHelper");
const NewFoodPackage = require("../models/foodPackageNew");
const { EnumUserRoles } = require("../helpers/constants");
const Interaction = require("../models/interaction");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const NAMESPACE = "Administrator";

/**to login into the system */
const Login = async (req, res) => {
    try {
        logging.info(NAMESPACE, "Login", "Login func called", {
            email: req.body.email,
            password: req.body.password,
        });
        //var user = await User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] }).select("-password").exec();
        var user = await User.findOne({
            email: req.body.email.toLowerCase(),
        }).exec();
        if (
            user &&
            (user.roleId == EnumUserRoles.SuperAdmin ||
                user.roleId == EnumUserRoles.SalesTeam ||
                user.roleId == EnumUserRoles.Gm)
        ) {
            const matchPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (matchPassword) {
                const token = jwt.sign(
                    {
                        user_id: user?._id,
                        email: req.body.email,
                        roleId: user?.roleId,
                        hotelId: user?.hotelId,
                    },
                    process.env.TOKEN_KEY
                );
                user.token = token;
                user.password = "";
                var rs = new iResponse(HTTPCodes.SUCCESS, user);
                rs.msg = "User data";
                return res.status(HTTPCodes.SUCCESS.status).json(rs);
            } else {
                var rs = new iResponse(HTTPCodes.ERROR, {});
                rs.msg =
                    "The password you entered is incorrect.Please try again";
                return res.status(HTTPCodes.ERROR.status).json(rs);
            }
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "User not found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(NAMESPACE, "Login", "Login func exception", ex);
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

const getUserData = async (req, res) => {
    try {
        if (!req.adminData) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Token is not valid";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, { UserInfo: req.adminData });
        rs.msg = "Item sent Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "getUserData", "getUserData exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};
/**to change the password */
const ForgotPassword = async (req, res) => {
    try {
        logging.info(NAMESPACE, "ForgotPassword", "ForgotPassword func");
        if (!req.body.email) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Email is required";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        } else {
            var userData = await User.findOne({
                email: req.body.email.toLowerCase(),
            }).exec();
            if (userData != null) {
                var data = {
                    firstName: userData.firstName,
                    link: req.body.link + `/${userData._id}`,
                    CurrentYear: new Date().toString().slice(11, 15),
                    email: req.body.email.toLowerCase(),
                };
                var emailtemplate = await EmailsTemplates.findOne({
                    templateTitle: "Forgot Password",
                }).exec();
                if (emailtemplate) {
                    var emailContent = emailtemplate.emailContent;
                    for (const key in data) {
                        var searchElement = `[${key}]`;
                        emailContent = emailContent.replaceAll(
                            searchElement,
                            data[key]
                        );
                    }
                    let mailOptions = {
                        from: `${emailtemplate.displayName} noreply@kestonevirtualevents.in`,
                        to: data.email,
                        subject: emailtemplate.subject,
                        text: "",
                        html: emailContent,
                    };
                    MailService.sendMail(mailOptions)
                        .then(function (email) {
                            logging.info(
                                NAMESPACE,
                                "emailer",
                                "Mail sent",
                                "success"
                            );
                            var rs = new iResponse(HTTPCodes.SUCCESS, {});
                            rs.msg =
                                "Link has been sent to your registered email-Id";
                            return res
                                .status(HTTPCodes.SUCCESS.status)
                                .json(rs);
                        })
                        .catch(function (exception) {
                            logging.info(
                                NAMESPACE,
                                "emailer",
                                "emailer db exception",
                                exception
                            );
                            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
                            rs.msg =
                                "Problem while sending email:-, " +
                                exception.message;
                            return res
                                .status(HTTPCodes.BADREQUEST.status)
                                .json(rs);
                        });
                }
            } else {
                var rs = new iResponse(HTTPCodes.BADREQUEST, {});
                rs.msg = "No account found";
                return res.status(HTTPCodes.BADREQUEST.status).json(rs);
            }
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "ForgotPassword",
            "ForgotPassword func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/** To reset the password  */
const ResetPassword = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "resetpassword",
            "Request reset password",
            req.body
        );
        if (!req.body.email || !req.body.password || !req.body.cpassword) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Missing required field";
            return res.status(400).json(rs);
        } else {
            if (req.body.password && req.body.cpassword) {
                if (req.body.password == req.body.cpassword) {
                    const hasedPassword = await bcrypt.hash(
                        req.body.password,
                        10
                    );
                    // const data = await User.findByIdAndUpdate(req.body.userId, { $set: { password: req.body.password } })
                    var userData = await User.findOneAndUpdate(
                        { email: req.body.email.toLowerCase() },
                        { $set: { password: hasedPassword } }
                    ).exec();
                    var rs = new iResponse(HTTPCodes.SUCCESS, {});
                    rs.msg = "Password sucessfully updated";
                    return res.status(200).json(rs);
                } else {
                    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
                    rs.msg = "Password and confirm password is not matching";
                    return res.status(400).json(rs);
                }
            }
        }
    } catch (ex) {
        logging.info(NAMESPACE, "ResetPassword", "ResetPassword Exception", ex);
        return res.status(500).json(new iResponse(HTTPCodes.ERROR, ex.message));
    }
};

/** */

const FoodCateListAll = async (req, res) => {
    try {
        logging.info(NAMESPACE, "FoodCategories", "FoodCategories func");
        var foodData = await FoodCategory.find().exec();
        if (foodData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, foodData);
            rs.msg = "FoodCategories";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "FoodCategories not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "FoodCategories",
            "FoodCategories func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/** to obatain the list of the food categories */
const FoodCateList = async (req, res) => {
    try {
        logging.info(NAMESPACE, "FoodCategories", "FoodCategories func");
        // var foodData = await FoodCategory.find().exec();
        const totalfoodData = await FoodCategory.find().count().exec();
        var page = req.params.page || 1;
        var perPage = eq.params.perPage || 1;
        const foodData = await FoodCategory.find()
            .skip((page - 1) * 10)
            .limit(perPage)
            .sort("-createdAt")
            .exec();

        if (foodData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, {
                foodData: foodData,
                totalPages: Math.ceil(totalfoodData / perPage),
                currentPage: page,
            });
            rs.msg = "FoodCategories";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "FoodCategories not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "FoodCategories",
            "FoodCategories func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to save the food Category */
const FoodCateData = async (req, res) => {
    try {
        logging.info(NAMESPACE, "FoodCategoryData", "FoodCategoryData func");
        const fooddata = new FoodCategory({ name: req.body.name });
        var fooData = await fooddata.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, fooData);
        rs.msg = "Food Category saved";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "FoodCategoryData",
            "FoodCategoryData func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to delete the particular food Category*/
const FoodCateDel = async (req, res) => {
    try {
        logging.info(NAMESPACE, "DelFoodCategory", "DelFoodCategory func");
        await FoodCategory.findByIdAndDelete(req.params.cateId).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Food Category Deleted";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "DelFoodCategory",
            "DelFoodCategory func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to update the food category Data */
const FoodCateUpd = async (req, res) => {
    try {
        logging.info(NAMESPACE, "FoodCategoryUpd", "FoodCategoryUpd func");
        await FoodCategory.findByIdAndUpdate(req.params.cateId, {
            $set: {
                name: req.body.name,
            },
        });
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Food category updated";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "FoodCategoryUpd",
            "FoodCategoryUpd func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/** to obtain the list of the all decor Categories */
const DecorCateListAll = async (req, res) => {
    try {
        logging.info(NAMESPACE, "DecorCateList", "DecorCateList func");
        var decorData = await DecorCategory.find().exec();
        if (decorData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, decorData);
            rs.msg = "DecorCateList";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "DecorCateList not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "DecorCateList",
            "DecorCateList func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/** to obtain the list of the decor Categories */
const DecorCateList = async (req, res) => {
    try {
        logging.info(NAMESPACE, "DecorCateList", "DecorCateList func");
        //var decorData = await DecorCategory.find().exec();
        const totaldecorData = await DecorCategory.find().count().exec();
        var page = req.params.page || 1;
        var perPage = eq.params.perPage || 1;
        const decorData = await DecorCategory.find()
            .skip((page - 1) * 10)
            .limit(perPage)
            .sort("-createdAt")
            .exec();
        if (decorData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, {
                decorData: decorData,
                totalPages: Math.ceil(totaldecorData / perPage),
                currentPage: page,
            });
            rs.msg = "DecorCateList";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "DecorCateList not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "DecorCateList",
            "DecorCateList func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to save the Decor Category */
const DecorCateData = async (req, res) => {
    try {
        logging.info(NAMESPACE, "DecorCategoryData", "DecorCategoryData func");
        var data = new DecorCategory({
            name: req.body.name,
        });
        await data.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, { data });
        rs.msg = "Decor Category saved";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "DecorCategoryData",
            "DecorCategoryData func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to delete the  particular Decor Category*/
const DecorCateDel = async (req, res) => {
    try {
        logging.info(NAMESPACE, "DecorCategoryDel", "DecorCategoryDel func");
        await DecorCategory.findByIdAndDelete(req.params.decorId).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Decor Category Deleted";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "DecorCategoryDel",
            "DecorCategoryDel func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to update the Decor category Data */
const DecorCateUpd = async (req, res) => {
    try {
        logging.info(NAMESPACE, "DecorCategoryUpd", "DecorCategoryUpd func");
        await DecorCategory.findByIdAndUpdate(req.params.decorId, {
            $set: {
                name: req.body.name,
            },
        });
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Decor category updated";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "DecorCategoryUpd",
            "DecorCategoryUpd func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/** to obtain the list of the  All Entertainemnet Categories */
const EntertainCateListAll = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "EntertainCateListAll",
            "EntertainCateListAll func"
        );
        var enterData = await EntertainCategory.find().exec();

        if (enterData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, enterData);
            rs.msg = "Entertainment Cate List";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Entertainment Cate List not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "EntertainCateListAll",
            "EntertainCateListAll func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};
/** to obtain the list of the Entertainemnet Categories */
const EntertainCateList = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "EntertainmentCateList",
            "EntertainmentCateList func"
        );
        //var enterData = await EntertainCategory.find().exec();
        const totalenterData = await EntertainCategory.find().count().exec();
        var page = req.params.page || 1;
        var perPage = eq.params.perPage || 1;
        const enterData = await EntertainCategory.find()
            .skip((page - 1) * 10)
            .limit(perPage)
            .sort("-createdAt")
            .exec();
        if (enterData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, {
                enterData: enterData,
                totalPages: Math.ceil(totalenterData / perPage),
                currentPage: page,
            });
            rs.msg = "Entertainment Cate List";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Entertainment Cate List not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "EntertainmentCateList",
            "EntertainmentCateList func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to save the Entertainment Category */
const EntertainCateData = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "EntertainmentCateData",
            "EntertainmentCateData func"
        );
        var data = new EntertainCategory({
            name: req.body.name,
        });
        await data.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, { data });
        rs.msg = "Entertainment Category saved";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "EntertainmentCateData",
            "EntertainmentCateData func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to delete the  particular Entetainment Category*/
const EntertainCateDel = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "EntertainmentCateDel",
            "EntertainmentCateDel func"
        );
        await EntertainCategory.findByIdAndDelete(req.params.enterId).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Entertainment Category deleted";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "EntertainmentCateDel",
            "EntertainmentCateDel func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to update the Entertainment category Data */
const EntertainCateUpd = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "EntertainmentCateUpd",
            "EntertainmentCateUpd func"
        );
        await EntertainCategory.findByIdAndUpdate(req.params.enterId, {
            $set: {
                name: req.body.name,
            },
        });
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Entertainment category updated";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "EntertainmentCateUpd",
            "EntertainmentCateUpd func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/** to obtain the list of the  all Wedding Community */
const WeddCateListAll = async (req, res) => {
    try {
        logging.info(NAMESPACE, "WeddCateListAll", "WeddCateListAll func");
        //var weddData = await WeddCommunity.find().exec();
        var page = req.params.page || 1;
        var perPage = eq.params.perPage || 1;
        const weddData = await WeddCommunity.find()
            .skip((page - 1) * 10)
            .limit(perPage)
            .sort("-createdAt")
            .exec();
        if (weddData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, {
                weddData: weddData,
                totalPages: Math.ceil(weddData.length / perPage),
                currentPage: page,
            });
            rs.msg = "Wedding community List";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Wedding community List not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "WeddCateListAll",
            "WeddCateListAll func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/** to obtain the list of the Wedding Community */
const WeddCateList = async (req, res) => {
    try {
        logging.info(NAMESPACE, "WeddCateList", "WeddCateList func");
        //var weddData = await WeddCommunity.find().exec();
        const totalweddData = await WeddCommunity.find().count().exec();
        var page = req.params.page || 1;
        var perPage = eq.params.perPage || 1;
        const weddData = await WeddCommunity.find()
            .skip((page - 1) * 10)
            .limit(perPage)
            .sort("-createdAt")
            .exec();
        if (weddData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, {
                weddData: weddData,
                totalPages: Math.ceil(totalweddData / perPage),
                currentPage: page,
            });
            rs.msg = "Wedding community List";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Wedding community List not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "WeddCateList",
            "WeddCateList func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to save the wedding community */
const WeddCateData = async (req, res) => {
    try {
        logging.info(NAMESPACE, "WeddCateData", "WeddCateData func");
        var data = new WeddCommunity({
            name: req.body.name,
        });
        await data.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Wedding community saved";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "WeddCateData",
            "WeddCateData func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to delete the  particular wedding community*/
const WeddCateDel = async (req, res) => {
    try {
        logging.info(NAMESPACE, "WeddCateDel", "WeddCateDel func");
        await WeddCommunity.findByIdAndDelete(req.params.weddId).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Wedding community deleted";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "WeddCateDel",
            "WeddCateDel func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to update the wedding community Data */
const WeddCateUpd = async (req, res) => {
    try {
        logging.info(NAMESPACE, "WeddCateUpd", "WeddCateUpd func");
        await EntertainCategory.findByIdAndUpdate(req.params.weddId, {
            $set: {
                name: req.body.name,
            },
        });
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Wedding community updated";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "WeddCateUpd",
            "WeddCateUpd func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/** to obtain the list of the Food */
const FoodList = async (req, res) => {
    try {
        logging.info(NAMESPACE, "FoodList", "FoodList func");
        //var foodData = await FoodItems.find().exec();
        const totalFoodItems = await FoodItems.find().count().exec();
        var page = req.params.page || 1;
        var perPage = req.params.perPage || 1;
        const foodData = await FoodItems.find()
            .skip((page - 1) * 10)
            .limit(perPage)
            .sort("-createdAt")
            .exec();
        if (foodData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, {
                foodData: foodData,
                totalPages: Math.ceil(totalFoodItems / perPage),
                currentPage: page,
            });
            rs.msg = "Food List";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Food List not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(NAMESPACE, "FoodList", "FoodList func exception", ex);
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

const FoodListByHotelId = async (req, res) => {
    try {
        logging.info(NAMESPACE, "FoodList", "FoodList func");
        //var foodData = await FoodItems.find().exec();
        const totalFoodItems = await FoodItems.find({
            hotelId: req.params.hotelId,
        })
            .populate({
                path: "categoryId",
                select: "name", // Specify the fields to populate
                model: "FoodCategory", // The model to use for population
                //match: { isActive: true }, // Optional: You can also add a match condition
                options: {
                    as: "category",
                },
            })
            .exec();

        if (totalFoodItems) {
            var rs = new iResponse(HTTPCodes.SUCCESS, { data: totalFoodItems });
            rs.msg = "Food List";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Food List not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(NAMESPACE, "FoodList", "FoodList func exception", ex);
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

const FoodById = async (req, res) => {
    logging.info(NAMESPACE, "FoodById", "Getting Food Info", req.params.id);
    var foodInfo = await FoodItems.findById(req.params.id).exec();
    try {
        var rs = new iResponse(HTTPCodes.SUCCESS, foodInfo);
        rs.msg = "Food Data";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (error) {
        logging.error(NAMESPACE, "FoodById", "FoodById exception", error);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to save the food item */
const FoodDataNew = async (req, res) => {
    try {
        logging.info(NAMESPACE, "FoodDataNew", "FoodDataNew func");
        var data = new FoodItems({
            name: req.body.name,
            price: req.body.price,
            desc: req.body.desc,
            hotelId: req.body.hotelId,
            categoryId: req.body.categoryId,
            isVeg: req.body.isVeg,
            image: req.body.image,
        });
        await data.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Food item saved";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "FoodDataNew",
            "FoodDataNew func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to update the food item */
const Foodupd = async (req, res) => {
    try {
        logging.info(NAMESPACE, "Foodupd", "Foodupd func", req.body);
        await FoodItems.findByIdAndUpdate(req.params.foodId, {
            $set: {
                name: req.body.name,
                price: req.body.price,
                desc: req.body.desc,
                hotelId: req.body.hotelId,
                categoryId: req.body.categoryId,
                isVeg: req.body.isVeg == 'false' ? false : true,
                image: req.body.image,
            },
        });
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Food item updated";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "Foodupd", "Foodupd func exception", ex);
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to delete the  particular food item*/
const FoodDel = async (req, res) => {
    try {
        logging.info(NAMESPACE, "FoodDel", "FoodDel func");
        await FoodItems.findByIdAndDelete(req.params.foodId).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Food item deleted";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "FoodDel", "FoodDel func exception", ex);
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/** to obtain the list of the Decor  */
const DecorList = async (req, res) => {
    try {
        logging.info(NAMESPACE, "DecorList", "DecorList func");
        //var decorData = await DecorItems.find().exec();
        const totalDecorItems = await DecorItems.find().count().exec();
        var page = req.params.page || 1;
        var perPage = req.params.perPage || 1;
        const decorData = await DecorItems.find()
            .skip((page - 1) * 10)
            .limit(perPage)
            .sort("-createdAt")
            .exec();
        if (decorData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, {
                decorData: decorData,
                totalPages: Math.ceil(totalDecorItems / perPage),
                currentPage: page,
            });
            rs.msg = "Decor items List";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Decor List not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(NAMESPACE, "DecorList", "DecorList func exception", ex);
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};
const GetDecorByHotelId = async (req, res) => {
    try {
        logging.info(NAMESPACE, "DecorList", "DecorList func");
        //var decorData = await DecorItems.find().exec();
        const decorData = await DecorItems.find({
            hotelId: req.params.hotelId,
        }).exec();

        if (decorData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, {
                decorData: decorData,
            });
            rs.msg = "Decor items List";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Decor List not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(NAMESPACE, "DecorList", "DecorList func exception", ex);
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

const DecorById = async (req, res) => {
    logging.info(NAMESPACE, "DecorById", "Getting Decor Info", req.params.id);
    var decorInfo = await DecorItems.findById(req.params.id).exec();
    try {
        var rs = new iResponse(HTTPCodes.SUCCESS, decorInfo);
        rs.msg = "Decor Data";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (error) {
        logging.error(NAMESPACE, "DecorById", "DecorById exception", error);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to save the decor item */
const DecorDataNew = async (req, res) => {
    try {
        logging.info(NAMESPACE, "DecorDataNew", "DecorDataNew func");
        var data = new DecorItems({
            name: req.body.name,
            price: req.body.price,
            desc: req.body.desc,
            hotelId: req.body.hotelId,
            categoryId: req.body.categoryId,
            image: req.body.image,
            tagName: req.body.tagName,
            images: req.body.images,
            videos: req.body.videos
        });
        await data.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Decor item saved";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "DecorDataNew",
            "DecorDataNew func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to update the food item */
const Decorupd = async (req, res) => {
    try {
        logging.info(NAMESPACE, "Decorupd", "Decorupd func", req.body);
        await DecorItems.findByIdAndUpdate(req.params.decoritemId, {
            $set: {
                name: req.body.name,
                price: req.body.price,
                desc: req.body.desc,
                hotelId: req.body.hotelId,
                categoryId: req.body.categoryId,
                image: req.body.image,
                tagName: req.body.tagName,
                images: req.body.images,
                videos: req.body.videos
            },
        });
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Decor item updated";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "Decorupd", "Decorupd func exception", ex);
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to delete the  particular food item*/
const DecorDel = async (req, res) => {
    try {
        logging.info(NAMESPACE, "DecorDel", "DecorDel func");
        await DecorItems.findByIdAndDelete(req.params.decoritemId).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Decor item deleted";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "DecorDel", "DecorDel func exception", ex);
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/** to obtain the list of the Entertainment  */
const EntertainmentList = async (req, res) => {
    try {
        logging.info(NAMESPACE, "EntertainmentList", "EntertainmentList func");
        //var entertainData = await EntertainmentItem.find().exec();
        const totalEntertainmentItem = await EntertainmentItem.find()
            .count()
            .exec();
        var page = req.params.page || 1;
        var perPage = req.params.perPage || 1;
        const entertainData = await EntertainmentItem.find()
            .skip((page - 1) * 10)
            .limit(perPage)
            .sort("-createdAt")
            .exec();
        if (entertainData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, {
                entertainData: entertainData,
                totalPages: Math.ceil(totalEntertainmentItem / perPage),
                currentPage: page,
            });
            rs.msg = "Entertainment items List";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Entertainment List not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "EntertainmentList",
            "EntertainmentList func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};
const EntertainmentList1 = async (req, res) => {
    try {
        logging.info(NAMESPACE, "EntertainmentList", "EntertainmentList func");
        //var entertainData = await EntertainmentItem.find().exec();
        // const totalEntertainmentItem = await EntertainmentItem.find()
        //     .count()
        //     .exec();
        // var page = req.params.page || 1;
        // var perPage = req.params.perPage || 1;
        const entertainData = await EntertainmentItem.find({
            hotelId: req.params.hotelId,
        })
            .populate({
                path: "categoryId",
                model: "EntertainmentCategory",
                select: "name", // Specify the fields you want to select from the Category model
            })
            .exec();
        if (entertainData) {
            var rs = new iResponse(HTTPCodes.SUCCESS, {
                entertainmentData: entertainData,
            });
            rs.msg = "Entertainment items List";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        } else {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Entertainment List not  found";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "EntertainmentList",
            "EntertainmentList func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

const EntertainmentById = async (req, res) => {
    logging.info(
        NAMESPACE,
        "EntertainmentById",
        "Getting Entertainment Info",
        req.params.id
    );
    var entInfo = await EntertainmentItem.findById(req.params.id).exec();
    try {
        var rs = new iResponse(HTTPCodes.SUCCESS, entInfo);
        rs.msg = "Entertainment Data";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (error) {
        logging.error(
            NAMESPACE,
            "EntertainmentById",
            "EntertainmentById exception",
            error
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to save the Entertainment item */
const EntertainmentDataNew = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "EntertainmentDataNew",
            "EntertainmentDataNew func"
        );
        var data = new EntertainmentItem({
            name: req.body.name,
            price: req.body.price,
            desc: req.body.desc,
            hotelId: req.body.hotelId,
            categoryId: req.body.categoryId,
            image: req.body.image,
            duration: req.body.duration,
            lang: req.body.language,
            images: req.body.images,
            videos: req.body.videos,
        });
        await data.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Entertainment item saved";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "EntertainmentDataNew",
            "EntertainmentDataNew func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to update the Entertainment item */
const Entertainmentupd = async (req, res) => {
    try {
        logging.info(NAMESPACE, "Entertainmentupd", "Entertainmentupd func");
        await EntertainmentItem.findByIdAndUpdate(req.params.enteritemId, {
            $set: {
                name: req.body.name,
                price: req.body.price,
                desc: req.body.desc,
                hotelId: req.body.hotelId,
                categoryId: req.body.categoryId,
                image: req.body.image,
                images: req.body.images,
                videos: req.body.videos,
                duration: req.body.duration,
                lang: req.body.lang,

            },
        });
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Entertainment item updated";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "Entertainmentupd",
            "Entertainmentupd func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to delete the  particular Entertainment item*/
const EntertainmentDel = async (req, res) => {
    try {
        logging.info(NAMESPACE, "EntertainmentDel", "EntertainmentDel func");
        await EntertainmentItem.findByIdAndDelete(
            req.params.enteritemId
        ).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Entertainment item deleted";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "EntertainmentDel",
            "EntertainmentDel func exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.ERROR, {});
        rs.msg = ex.mesage;
        return res.status(HTTPCodes.ERROR.status).json(rs);
    }
};

/**to get all the hotels */
const GetAllHotels = async (req, res) => {
    logging.info(NAMESPACE, "GetAllHotels", "Getting All Hotel Info");
    try {
        const totalHotels = await Hotels.find().count().exec();
        var page = req.params.page || 1;
        var perPage = req.params.perPage || 1;
        const allHotels = await Hotels.find()
            .skip((page - 1) * 10)
            .limit(perPage)
            .sort("-createdAt")
            .exec();
        return res.status(HTTPCodes.SUCCESS.status).json(
            new iResponse(HTTPCodes.SUCCESS, {
                allHotels: allHotels,
                totalPages: Math.ceil(totalHotels / perPage),
                currentPage: page,
            })
        );
    } catch (error) {
        logging.error(
            NAMESPACE,
            "GetAllHotels",
            "GetAllHotels exception",
            error
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get all the hotels */
const GetAllHotels1 = async (req, res) => {
    logging.info(NAMESPACE, "GetAllHotels", "Getting All Hotel Info");
    try {
        const { adminData } = req;
        const { user_id, roleId } = adminData;

        let totalHotels = [];
        if (roleId === 1) {
            totalHotels = await Hotels.find().exec();
        } else {
            const user = await User.findById(user_id).exec();
            if (user) {
                totalHotels = await Hotels.find({ _id: user?.hotelId }).exec();
            }
        }

        // var page = req.params.page || 1;
        // var perPage = req.params.perPage || 1;
        // const allHotels = await Hotels.find()
        //     .skip((page - 1) * 10)
        //     .limit(perPage)
        //     .sort("-createdAt")
        //     .exec();
        return res
            .status(HTTPCodes.SUCCESS.status)
            .json(new iResponse(HTTPCodes.SUCCESS, { allHotels: totalHotels }));
    } catch (error) {
        logging.error(
            NAMESPACE,
            "GetAllHotels",
            "GetAllHotels exception",
            error
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/** to save the Hotel */
const SaveHotel = async (req, res) => {
    logging.info(NAMESPACE, "SaveHotel", "Saving Hotel Details", req.body);
    let hotel = new Hotels({
        hotelName: req.body.hotelName,
        urlName: req.body.urlName,
        imageUrl: req.body.imageUrl,
        location: req.body.location,
        address: req.body.address,
        friendlyName: req.body.friendlyName,
        planMyEvent: req?.body?.planMyEvent,
        roomInfo: [],
        contactInfo: {
            restaurant: {
                email: req.body.contactInfo.restaurant.email,
                contactNo: req.body.contactInfo.restaurant.contactNo,
            },
            room: {
                email: req.body.contactInfo.room.email,
                contactNo: req.body.contactInfo.room.contactNo,
            },
            banquet: {
                email: req.body.contactInfo.banquet.email,
                contactNo: req.body.contactInfo.banquet.contactNo,
            },
        },
    });
    await hotel
        .save()
        .then(async (result) => {
            logging.info(
                NAMESPACE,
                "SaveHotel",
                "Hotel details saved successfully",
                result
            );
            req.session.sideMenu = await Hotels.find().exec();
            return res.status(200).json({
                success: true,
                redirect: true,
                url: "/admin/allHotels",
                msg: "Hotel details saved successfully!",
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, "SaveHotel", "Error while saving", error);
            return res.status(200).json({
                success: false,
                msg: error._message,
            });
        });
};

/**to delete the hotel by id */
const DeleteHotelById = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "DeleteHotelById",
            "Deleting Hotel by Id",
            req.params.hotelId
        );
        const { adminData } = req;
        if (adminData?.roleId != 1) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Only Admin can delete Hotel";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        let result = await Hotels.findByIdAndDelete(req.params.hotelId)
            .exec()
            .catch((error) => {
                logging.error(
                    NAMESPACE,
                    "DeleteHotelById",
                    "Error while Deleting",
                    error
                );
                return res.status(200).json({
                    success: false,
                    msg: error._message,
                });
            });
        if (result) {
            logging.info(
                NAMESPACE,
                "DeleteHotelById",
                "Hotel Deleted successfully",
                result
            );
            req.session.sideMenu = await Hotels.find().exec();
            return res.status(200).json({
                success: true,
                redirect: true,
                msg: "Hotel Deleted successfully!",
            });
        }
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "DeleteHotelById",
            "DeleteHotelById exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get the hotel by id */
const GetHotelById = async (req, res) => {
    logging.info(
        NAMESPACE,
        "GetHotelById",
        "Getting Hotel Info",
        req.params.hotelId
    );
    var hotelInfo = await Hotels.findById(req.params.hotelId).exec();
    try {

        var rs = new iResponse(HTTPCodes.SUCCESS, hotelInfo);
        rs.msg = "Hotels Data";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (error) {
        logging.error(
            NAMESPACE,
            "GetHotelById",
            "GetHotelById exception",
            error
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to edit hotel info */
const EditHotelInfo = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "EditHotelInfo",
            "Getting Hotel Info",
            req.params.hotelId
        );
        var hotelInfo = await Hotels.findById(req.params.hotelId).exec();
        return res
            .status(HTTPCodes.SUCCESS.status)
            .json(new iResponse(HTTPCodes.SUCCESS, hotelInfo));
    } catch (error) {
        logging.error(NAMESPACE, "EditHotelInfo", error.message);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to update the hotel info */
const UpdateHotelInfo = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "UpdateHotelInfo",
            "Updating Hotel Info",
            req.body
        );
        var hotelInfo = await Hotels.findById(req.body._id).exec();
        hotelInfo.hotelName = req.body.hotelName;
        hotelInfo.address = req.body.address;
        hotelInfo.location = req.body.location;
        hotelInfo.imageUrl = req.body.imageUrl;
        hotelInfo.contactInfo = req.body.contactInfo;
        hotelInfo.urlName = req.body.urlName;
        hotelInfo.friendlyName = req.body.friendlyName;
        hotelInfo.planMyEvent = req.body.planMyEvent;
        if (req?.body?.callback) {
            hotelInfo.callback = req?.body?.callback
        }
        await Hotels.findByIdAndUpdate(req.body._id, { $set: hotelInfo })
            .then(async (result) => {
                logging.error(
                    NAMESPACE,
                    "UpdateHotelInfo",
                    "Hotel details updated successfully",
                    result
                );
                req.session.sideMenu = await Hotels.find().exec();
                return res.status(200).json({
                    success: true,
                    redirect: true,
                    msg: "Hotel details updated successfully!",
                });
            })
            .catch((error) => {
                logging.error(
                    NAMESPACE,
                    "UpdateHotelInfo",
                    "Error while updating",
                    error
                );
                var rs = new iResponse(HTTPCodes.BADREQUEST, {});
                rs.msg = error.message;
                return res.status(HTTPCodes.BADREQUEST.status).json(rs);
            });
    } catch (ex) {
        logging.error(NAMESPACE, "UpdateHotelInfo", ex.message);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get all rooms of the hotel */
const GetAllRooms = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "Get ALL Rooms",
            "Get ALL Rooms",
            req.params.hotelId
        );
        //var hotel = await Hotels.findById(req.params.hotelId).exec();
        var page = req.params.page || 1;
        var perPage = req.params.perPage || 1;
        console.log(page, perPage);
        // const hotel = await Hotels.findById(req.params.hotelId)
        //     .limit(perPage)
        //     .skip((page - 1) * 10)
        //     .sort("-createdAt")
        //     .exec();
        // console.log("hotel", hotel);
        var roomsData = [];
        // for (var i = 0; i < perPage; i++) {
        //     roomsData.push(hotel.roomInfo[i])
        // }
        const hotel = await Hotels.findById(req.params.hotelId);
        //console.log("hotel", hotel);
        var roomsData = hotel?.roomInfo;
        var startIndex = (page - 1) * perPage;
        var endingIndex =
            page * perPage > roomsData?.length
                ? roomsData?.length
                : page * perPage;
        //console.log("=====", roomsData.slice(startIndex, endingIndex))
        return res.status(HTTPCodes.SUCCESS.status).json(
            new iResponse(HTTPCodes.SUCCESS, {
                roomsData: roomsData.slice(startIndex, endingIndex),
                totalPages: Math.ceil(hotel.roomInfo.length / perPage),
                currentPage: page,
            })
        );
        // return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, { roomsData: roomsData, totalPages: Math.ceil(hotel.roomInfo.length / perPage), currentPage: page }));
    } catch (error) {
        logging.error(NAMESPACE, "Get ALL Rooms", error.message);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const GetAllRooms1 = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "Get ALL Rooms",
            "Get ALL Rooms",
            req.params.hotelId
        );
        //var hotel = await Hotels.findById(req.params.hotelId).exec();
        // var page = req.params.page || 1;
        // var perPage = req.params.perPage || 1;
        // console.log(page, perPage);
        // const hotel = await Hotels.findById(req.params.hotelId)
        //     .limit(perPage)
        //     .skip((page - 1) * 10)
        //     .sort("-createdAt")
        //     .exec();
        // console.log("hotel", hotel);
        var roomsData = [];
        // for (var i = 0; i < perPage; i++) {
        //     roomsData.push(hotel.roomInfo[i])
        // }
        const hotel = await Hotels.findById(req.params.hotelId);
        //console.log("hotel", hotel);
        var roomsData = hotel?.roomInfo;
        // var startIndex = (page - 1) * perPage;
        // var endingIndex =
        //     page * perPage > roomsData?.length
        //         ? roomsData?.length
        //         : page * perPage;
        //console.log("=====", roomsData.slice(startIndex, endingIndex))
        return res.status(HTTPCodes.SUCCESS.status).json(
            new iResponse(HTTPCodes.SUCCESS, {
                roomsData: roomsData,
            })
        );
        // return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, { roomsData: roomsData, totalPages: Math.ceil(hotel.roomInfo.length / perPage), currentPage: page }));
    } catch (error) {
        logging.error(NAMESPACE, "Get ALL Rooms", error.message);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = error.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to save the new room */
const SaveNewRoom = async (req, res) => {
    try {
        logging.info(NAMESPACE, "SaveNewRoom", "Saving Room Details", req.body);
        if (req.body.roomId.trim() == "") {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Room/Pano Id is required";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        if (req.body.roomName.trim() == "") {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Room/Pano name is required";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        let list = [];
        // if (
        //     req.body.virtualSittingArrangement.enable &&
        //     req.body.virtualSittingArrangement.data
        // ) {
        //     req.body?.virtualSittingArrangement_categories?.forEach(
        //         (category) => {
        //             var data = {
        //                 name: category,
        //                 data: [],
        //             };
        //             let objs = req.body.virtualSittingArrangement.data.filter(
        //                 (x) => x.category == category
        //             );
        //             var data1;
        //             req.body.virtualSittingArrangement_name.forEach((name) => {
        //                 data1 = {
        //                     name: name,
        //                     seats: [],
        //                 };
        //                 let names = objs.filter((x) => x.name == name);
        //                 names.forEach((rec) => {
        //                     data1.seats.push({
        //                         panoId: rec.panoId,
        //                         name: rec.seats,
        //                     });
        //                 });
        //                 data.data.push(data1);
        //             });
        //             list.push(data);
        //         }
        //     );
        // }
        var hotel = await Hotels.findById(req.body.hotelId).exec();
        let roomInfo = {
            roomId: req.body.roomId.trim(),
            roomName: req.body.roomName.trim(),
            bookAVenue: req.body.bookAVenue == true ? true : false,
            bookAMeeting: req.body.bookAMeeting == true ? true : false,
            menuPDF: {
                enable: req.body.menuPDF.enable == true ? true : false,
                images: req.body.menuPDF.images ? req.body.menuPDF.images : [],
            },
            // foodMenu: {
            //     enable: req.body.foodMenu.enable == true ? true : false,
            //     data: req.body.foodMenu.data.map((item) => ({
            //         title: item.title ? item.title.trim() : "",
            //         imageUrl: item.imageUrl ? item.imageUrl.trim() : "",
            //     })),
            // },
            // entertainment: {
            //     enable: req.body?.entertainment?.enable == true ? true : false,
            //     data: req.body.foodMenu.data.map((item) => ({
            //         title: item.title ? item.title.trim() : "",
            //         imageUrl: item.imageUrl ? item.imageUrl.trim() : "",
            //     })),
            // },
            bookingLink: {
                enable: req.body.bookingLink.enable == true ? true : false,
                link: req.body.bookingLink.link.trim(),
            },
            facilityDetailer: {
                enable: req.body.facilityDetailer.enable == true ? true : false,
                data: req.body.facilityDetailer.data
                    ? {
                        imgEnable:
                            req.body.facilityDetailer.data.imgEnable == true
                                ? true
                                : false,
                        imgUrl: req.body.facilityDetailer.data.imgUrl.trim(),
                        title: req.body.facilityDetailer.data.title.trim(),
                        body: req.body.facilityDetailer.data.body.trim(),
                    }
                    : {},
            },
            dayNightToggle: {
                enable: req.body.dayNightToggle.enable == true ? true : false,
                data: req.body.dayNightToggle.data
                    ? {
                        type: req.body.dayNightToggle.data.type.trim(),
                        dayPanoId:
                            req.body.dayNightToggle.data.dayPanoId.trim(),
                        nightPanoId:
                            req.body.dayNightToggle.data.nightPanoId.trim(),
                    }
                    : {},
            },
            // imageGallery: {
            //     enable: req.body.imageGallery.enable == true ? true : false,
            //     images: req.body.imageGallery.photos
            //         ? req.body.imageGallery.photos
            //         : [],
            // },
            imageGallery: {
                enable: req.body.imageGallery.enable == true ? true : false,
                images: req.body.imageGallery.images
                    ? req.body.imageGallery.images
                    : [],
            },
            virtualSittingArrangement: {
                enable:
                    req.body.virtualSittingArrangement.enable == true
                        ? true
                        : false,
                data: req.body.virtualSittingArrangement.data,
            },
            roomType: req.body.roomType,
            glb: req.body.glb,
        };
        hotel.roomInfo.push(roomInfo);
        await Hotels.findByIdAndUpdate(req.body.hotelId, { $set: hotel })
            .then(async (result) => {
                logging.error(
                    NAMESPACE,
                    "SaveNewRoom",
                    "Room details saved successfully",
                    result
                );
                return res.status(200).json({
                    success: true,
                    redirect: true,
                    url: `/admin/hotels/${req.body.hotelId}`,
                    msg: "Room details saved successfully!",
                });
            })
            .catch((error) => {
                logging.error(
                    NAMESPACE,
                    "SaveNewRoom",
                    "Error while saving",
                    error
                );
                var rs = new iResponse(HTTPCodes.BADREQUEST, {});
                rs.msg = error.message;
                return res.status(HTTPCodes.BADREQUEST.status).json(rs);
            });
    } catch (ex) {
        logging.error(NAMESPACE, "SaveNewRoom", "SaveNewRoom exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to edit the Hotel Room */
const EditHotelRoom = async (req, res) => {
    try {
        logging.info(NAMESPACE, "EditHotelRoom", "Edit Hotel Room", req.params);
        let hotel = await Hotels.findById(req.params.hotelId).exec();
        console.log("payload", req.body)
        hotel.roomInfo.filter((x, index) => {
            if (x.roomId == req.params.roomId) {
                let d = hotel.roomInfo[index];
                (d.roomId = req.params.roomId),
                    (d.roomName = req.body.roomName),
                    (d.bookAVenue = req.body.bookAVenue),
                    (d.bookAMeeting = req.body.bookAMeeting),
                    (d.menuPDF = req.body.menuPDF),
                    (d.bookingLink = req.body.bookingLink),
                    (d.facilityDetailer = req.body.facilityDetailer),
                    (d.dayNightToggle = req.body.dayNightToggle),
                    (d.imageGallery = req.body.imageGallery),
                    (d.virtualSittingArrangement =
                        req.body.virtualSittingArrangement),
                    (d.foodMenu = req.body.foodMenu),
                    (d.entertainment = req.body.entertainment),
                    (d.glb = req.body.glb);
                hotel.roomInfo[index] = d;
            }
        });
        // if (!roomInfo.menuPDF) {
        //     roomInfo.menuPDF = {
        //         enable: false,
        //         images: []
        //     }
        //     roomInfo.bookingLink = {
        //         enable: false,
        //         link: ''
        //     }
        // }
        // let virtualSittingArrangement = [];
        // if (roomInfo.virtualSittingArrangement.data) {
        //     roomInfo.virtualSittingArrangement.data.forEach((obj) => {
        //         obj.data.forEach((ele) => {
        //             if (ele.seats) {
        //                 ele.seats.forEach((seat) => {
        //                     let data = {
        //                         category: obj.name,
        //                         name: ele.name,
        //                         seats: seat.name,
        //                         panoId: seat.panoId
        //                     };
        //                     virtualSittingArrangement.push(data);
        //                 })
        //             }
        //             else {
        //                 let data = {
        //                     category: obj.name,
        //                     name: ele.name,
        //                     seats: "",
        //                     panoId: ele.panoId
        //                 };
        //                 virtualSittingArrangement.push(data);
        //             }
        //         });
        //     });
        // }
        // roomInfo.virtualSittingArrangement.data = virtualSittingArrangement;
        return res
            .status(HTTPCodes.SUCCESS.status)
            .json({ roomInfo: hotel.roomInfo, success: true });
    } catch (error) {
        logging.error(NAMESPACE, "EditHotelRoom", error.message);
        return res.status(500).json({
            success: false,
            error: "An error occurred while fetching room information.",
        });
    }
};

/**to update the hotel room */
const UpdateHotelRoom = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "UpdateHotelRoom",
            "Updating Room Details",
            req.body
        );
        if (req.body.roomId.trim() == "") {
            return res
                .status(404)
                .json({ success: false, msg: "Room/Pano Id is required" });
        }
        if (req.body.roomName.trim() == "") {
            return res
                .status(404)
                .json({ success: false, msg: "Room/Pano name is required" });
        }
        let list = [];
        // if (
        //     req.body?.virtualSittingArrangement?.enable &&
        //     req?.body?.virtualSittingArrangement?.data
        // ) {
        //     req?.body?.virtualSittingArrangement_categories?.forEach(
        //         (category) => {
        //             var data = {
        //                 name: category,
        //                 data: [],
        //             };
        //             let objs =
        //                 req?.body?.virtualSittingArrangement?.data?.filter(
        //                     (x) => x.category == category
        //                 );
        //             var data1;
        //             req?.body?.virtualSittingArrangement_name.forEach(
        //                 (name) => {
        //                     data1 = {
        //                         name: name,
        //                         seats: [],
        //                     };
        //                     let names = objs.filter((x) => x.name == name);
        //                     names.forEach((rec) => {
        //                         data1.seats.push({
        //                             panoId: rec.panoId,
        //                             name: rec.seats,
        //                         });
        //                     });
        //                     data.data.push(data1);
        //                 }
        //             );
        //             list.push(data);
        //         }
        //     );
        // }
        var hotel = await Hotels.findById(req.body.hotelId).exec();
        let roomInfo = {
            roomId: req.body.roomId.trim(),
            roomName: req.body.roomName.trim(),
            bookAVenue: req.body.bookAVenue == true ? true : false,
            bookAMeeting: req.body.bookAMeeting == true ? true : false,
            menuPDF: {
                enable: req.body.menuPDF.enable == true ? true : false,
                images: req.body.menuPDF.images ? req.body.menuPDF.images : [],
            },
            bookingLink: {
                enable: req.body.bookingLink.enable == true ? true : false,
                link: req.body.bookingLink.link.trim(),
            },
            facilityDetailer: {
                enable:
                    req.body.facilityDetailer.enable == true ? true : false,
                data: req.body.facilityDetailer.data
                    ? {
                        imgEnable:
                            req.body.facilityDetailer.data.imgEnable == true
                                ? true
                                : false,
                        imgUrl: req.body.facilityDetailer.data.imgUrl.trim(),
                        title: req.body.facilityDetailer.data.title.trim(),
                        body: req.body.facilityDetailer.data.body.trim(),
                    }
                    : {},
            },
            dayNightToggle: {
                enable: req.body.dayNightToggle.enable == true ? true : false,
                data: req.body.dayNightToggle.data
                    ? {
                        type: req.body.dayNightToggle.data.type.trim(),
                        dayPanoId:
                            req.body.dayNightToggle.data.dayPanoId.trim(),
                        nightPanoId:
                            req.body.dayNightToggle.data.nightPanoId.trim(),
                    }
                    : {},
            },
            imageGallery: {
                enable: req.body.imageGallery.enable == true ? true : false,
                images: req.body.imageGallery.images
                    ? req.body.imageGallery.images
                    : [],
            },
            virtualSittingArrangement: {
                enable:
                    req.body.virtualSittingArrangement.enable == true
                        ? true
                        : false,
                data: req.body.virtualSittingArrangement.data,
            },
            roomType: req.body.roomType,
            glb: req.body.glb
        };
        const indices = hotel.roomInfo.map((room, index) => room.roomId == req.body.roomId ? index : -1);
        const foundIndex = indices.find(index => index !== -1);
        if (foundIndex !== undefined) hotel.roomInfo[foundIndex] = roomInfo;
        await Hotels.findByIdAndUpdate(req.body.hotelId, { $set: hotel })
            .then(async (result) => {
                logging.error(
                    NAMESPACE,
                    "UpdateHotelRoom",
                    "Room details updated successfully",
                    result
                );
                return res.status(200).json({
                    success: true,
                    redirect: true,
                    url: `/admin/hotels/${req.body.hotelId}`,
                    msg: "Room details updated successfully!",
                });
            })
            .catch((error) => {
                logging.error(
                    NAMESPACE,
                    "UpdateHotelRoom",
                    "Error while saving",
                    error
                );
                var rs = new iResponse(HTTPCodes.BADREQUEST, {});
                rs.msg = error.message;
                return res.status(HTTPCodes.BADREQUEST.status).json(rs);
            });
    } catch (ex) {
        logging.error(NAMESPACE, "UpdateHotelRoom", "Error while saving", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to delete the hotel room */
const DeleteHotelRoom = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "DeleteHotelRoom",
            "Deleting Hotel Room",
            req.params
        );
        var hotelInfo = await Hotels.findById(req.params.hotelId).exec();
        hotelInfo.roomInfo.filter((x, index) => {
            if (x.roomId == req.params.roomId) {
                hotelInfo.roomInfo.splice(index, 1);
            }
        });
        await Hotels.findByIdAndUpdate(req.params.hotelId, { $set: hotelInfo })
            .then(async (result) => {
                logging.error(
                    NAMESPACE,
                    "DeleteHotelRoom",
                    "Hotel room deleted successfully",
                    result
                );
                return res.status(200).json({
                    success: true,
                    redirect: true,
                    url: `/admin/hotels/${req.params.hotelId}?#nav-rooms`,
                    msg: "Hotel room deleted successfully!",
                });
            })
            .catch((error) => {
                logging.error(
                    NAMESPACE,
                    "DeleteHotelRoom",
                    "Error while deleting",
                    error
                );
                var rs = new iResponse(HTTPCodes.BADREQUEST, {});
                rs.msg = error.message;
                return res.status(HTTPCodes.BADREQUEST.status).json(rs);
            });
    } catch (ex) {
        logging.error(NAMESPACE, "DeleteHotelRoom", "Error while deleting", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const FoodPackageById = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "FoodPackageById",
            "FoodPackageById",
            req.params
        );
        const { id } = req.params;
        if (!id) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        const foodPackage = await NewFoodPackage.findById(id)
            // .populate({
            //     path: "foodCategories.categoryId",
            //     model: "FoodCategory",
            //     select: "name", // Specify the fields you want to select from the Category model
            // })
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
        logging.error(
            NAMESPACE,
            "FoodPackageById",
            "FoodPackageById exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const FoodpackageByHotelId = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "FoodpackageByHotelId",
            "FoodpackageByHotelId",
            req.params
        );
        const { hotelId } = req.params;
        if (!hotelId) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var page = req.params.page || 1;
        var perPage = req.params.perPage || 1;
        const totalNewFoodPackage = await NewFoodPackage.find().count().exec();
        const foodPackage = await NewFoodPackage.find({ hotelId: hotelId })
            .populate({
                path: "foodCategories.categoryId",
                model: "FoodCategory",
                select: "name", // Specify the fields you want to select from the Category model
            })
            .skip((page - 1) * 10)
            .limit(perPage)
            .sort("-createdAt")
            .exec();

        if (!foodPackage) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Item doesn't exists";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, {
            foodPackage: foodPackage,
            totalPages: Math.ceil(totalNewFoodPackage / perPage),
            currentPage: page,
        });
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "FoodpackageByHotelId",
            "FoodpackageByHotelId exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const FoodpackageByHotelId2 = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "FoodpackageByHotelId",
            "FoodpackageByHotelId2",
            req.params
        );
        const { hotelId } = req.params;
        if (!hotelId) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        // var page = req.params.page || 1;
        // var perPage = req.params.perPage || 1;
        // const totalNewFoodPackage = await NewFoodPackage.find().count().exec();
        const foodPackage = await NewFoodPackage.find({ hotelId: hotelId })
            .populate({
                path: "foodCategories.categoryId",
                model: "FoodCategory",
                select: "name", // Specify the fields you want to select from the Category model
            })
            // .skip((page - 1) * 10)
            // .limit(perPage)
            // .sort("-createdAt")
            .exec();

        if (!foodPackage) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Item doesn't exists";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, { foodPackage: foodPackage });
        rs.msg = "Item found Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "FoodpackageByHotelId",
            "FoodpackageByHotelId exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};
const SaveFoodPackage = async (req, res) => {
    try {
        logging.info(NAMESPACE, "SaveFoodPackage", "SaveFoodPackage", req.body);
        const { name, hotelId, foodCategories } = req.body;
        // console.log(name, hotelId, foodCategories);
        if (!name || !hotelId || !foodCategories) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Required fields are missing";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        const foodPackage = new NewFoodPackage({
            name,
            hotelId,
            foodCategories,
        });
        await foodPackage.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Item saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "SaveFoodPackage",
            "SaveFoodPackage exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const UpdateFoodPackage = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "UpdateFoodPackage",
            "UpdateFoodPackage",
            req.body
        );
        const { _id, name, hotelId, foodCategories } = req.body;
        // console.log("apex", id, name, hotelId, foodCategories)
        if (!name || !hotelId || !foodCategories) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Required fields are missing";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        const foodPackage = await NewFoodPackage.findById(_id).exec();
        console.log("first", foodPackage);
        if (!foodPackage) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Not found";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        name
            ? (foodPackage.name = name)
            : (foodPackage.name = foodPackage.name);
        hotelId
            ? (foodPackage.hotelId = hotelId)
            : (foodPackage.hotelId = hotelId);
        foodCategories
            ? (foodPackage.foodCategories = foodCategories)
            : (foodPackage.foodCategories = foodPackage.foodCategories);
        console.log("last", foodPackage);
        await foodPackage.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Item saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "UpdateFoodPackage",
            "UpdateFoodPackage exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const DeleteFoodPackage = async (req, res) => {
    try {
        logging.info(
            NAMESPACE,
            "DeleteFoodPackage",
            "DeleteFoodPackage",
            req.params
        );
        const { packId } = req.params;
        if (!packId) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        await NewFoodPackage.findByIdAndDelete(packId).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Item Deleted Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "DeleteFoodPackage",
            "DeleteFoodPackage exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get all UserRequiremnet Data */
const UserRequirements = async (req, res) => {
    try {
        logging.info(NAMESPACE, "UserRequirements", "UserRequirements");
        const { adminData } = req;
        console.log(adminData, "adminData");
        var data = {};
        if (adminData?.roleId == 1) {
            data = await UserRequiremnet.find()
                .populate({
                    path: "userId",
                    select: ["name", "email", "phone"],
                    model: BookingUser,
                })
                .populate({
                    path: "hotelId",
                    select: ["hotelName"],
                    model: Hotels,
                }).populate("decorComposition")
                .populate("entertainmentComposition").populate("composition")
                .exec();
        } else {
            const user = await User.findById(adminData?.user_id).exec();
            if (user) {
                data = await UserRequiremnet.find({ hotelId: user?.hotelId })
                    .populate({
                        path: "userId",
                        select: ["name", "email", "phone"],
                        model: BookingUser,
                    })
                    .populate({
                        path: "hotelId",
                        select: ["hotelName"],
                        model: Hotels,
                    })
                    .exec();
            }
        }

        var rs = new iResponse(HTTPCodes.SUCCESS, data);
        rs.msg = "UserRequirements Data";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "UserRequirements",
            "UserRequirements exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get all UserRequiremnet Data based on HotelID */
const UserRequirement = async (req, res) => {
    try {
        logging.info(NAMESPACE, "UserRequirement", "UserRequirement exception");
        var data = await UserRequiremnet.find({ hotelId: req.params.hotelId })
            .populate({
                path: "userId",
                select: ["name", "email", "phone"],
                model: BookingUser,
            })
            .exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, data);
        rs.msg = "UserRequirement Data";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "UserRequirement",
            "UserRequirement exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};
const UserRequirementById = async (req, res) => {
    try {
        logging.info(NAMESPACE, "UserRequirement", "UserRequirement exception");
        // var data = await UserRequiremnet.find({ hotelId: req.params.hotelId })
        const data = await UserRequiremnet.findById(req.params.id).populate({
            path: "userId",
            select: ["name", "email", "phone"],
            model: BookingUser,
        })
            .populate({
                path: "hotelId",
                select: ["hotelName"],
                model: Hotels,
            }).populate("decorComposition")
            .populate("entertainmentComposition").populate("composition")
            .exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, data);
        rs.msg = "UserRequirement Data";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(
            NAMESPACE,
            "UserRequirement",
            "UserRequirement exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

/**to get all UserRequiremnet Data based on HotelID */
const Users = async (req, res) => {
    try {
        logging.info(NAMESPACE, "Users", "Users function called");
        const { adminData } = req;
        const roleId = adminData?.roleId || 3;
        if (roleId == 1) {
            var data = await User.find({ roleId: { $gte: roleId } })
                .select("-password")
                .exec();
            var rs = new iResponse(HTTPCodes.SUCCESS, data);
            rs.msg = "Users Data";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        }
        else {
            var data = await User.find({ roleId: { $gt: roleId } })
                .select("-password")
                .exec();
            var rs = new iResponse(HTTPCodes.SUCCESS, data);
            rs.msg = "Users Data";
            return res.status(HTTPCodes.SUCCESS.status).json(rs);
        }

    } catch (ex) {
        logging.error(NAMESPACE, "Users", "Users exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const addUser = async (req, res) => {
    try {
        logging.info(NAMESPACE, "Users", "Users function called");
        const {
            firstName,
            lastName,
            roleId,
            avatar,
            hotelId,
            password,
            email,
        } = req.body;
        if (
            !firstName ||
            !lastName ||
            !roleId ||
            !avatar ||
            !hotelId ||
            !email
        ) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Required fields are missing";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        const existUser = await User.findOne({ email: email }).exec();
        if (existUser) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Email already exists";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        let encryptedPass;
        password
            ? (encryptedPass = bcrypt.hashSync(password, 10))
            : (encryptedPass = bcrypt.hashSync("India@123", 10));
        const user = new User({
            firstName,
            hotelId,
            lastName,
            roleId,
            avatar,
            password: encryptedPass,
            email,
        });
        await user.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Item saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "Users", "Users exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const updateUser = async (req, res) => {
    try {
        logging.info(NAMESPACE, "Users", "Users function called");
        const { _id, firstName, lastName, roleId, avatar, hotelId, password } =
            req.body;
        const user = await User.findById(_id).exec();
        if (!user) {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {});
            rs.msg = "Not found";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
        firstName
            ? (user.firstName = firstName)
            : (user.firstName = user.firstName);
        lastName ? (user.lastName = lastName) : (user.lastName = user.lastName);
        roleId ? (user.roleId = roleId) : (user.roleId = user.roleId);
        avatar ? (user.avatar = avatar) : (user.avatar = user.avatar);
        hotelId ? (user.hotelId = hotelId) : (user.hotelId = user.hotelId);
        password ? (user.password = password) : (user.password = user.password);
        await user.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Item saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "Users", "Users exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const deleteUser = async (req, res) => {
    try {
        logging.info(NAMESPACE, "Users", "Users function called");
        const { id } = req.params;
        if (!id) {
            var rs = new iResponse(HTTPCodes.NOTFOUND, {});
            rs.msg = "Id is required";
            return res.status(HTTPCodes.NOTFOUND.status).json(rs);
        }
        await User.findByIdAndDelete(id).exec();
        var rs = new iResponse(HTTPCodes.SUCCESS, {});
        rs.msg = "Item Deleted Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "Users", "Users exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const changeDateFormat = (stDate, enDate) => {
    let start = new Date();
    let end = new Date();
    if (enDate !== "undefined") {
        if (stDate !== "undefined") {
            start = new Date(stDate);
            end = new Date(enDate)
        } else {
            end = new Date(enDate);
            start.setDate(end.getDate() - 30)
        }
    } else {
        if (stDate !== "undefined") {
            start = new Date(stDate);
            end = new Date()
        } else {
            end = new Date();
            start.setDate(end.getDate() - 30)
        }
    }
    return { start, end }
}

// changes here

const getDistinctUser = async (stDate, enDate, roleId, hotelId) => {
    try {
        const start = new Date(stDate);
        const end = new Date(enDate);
        end.setHours(23, 59, 59, 999);

        const query = {
            createdAt: { $gte: new Date(start), $lt: new Date(end) }
        }

        if (roleId == 2 || roleId == 3) {
            query.hotelId = hotelId
        }

        const users = await BookingUser.distinct('email', query).exec();
        return users?.length
    } catch (ex) {
        return 0
    }
}

const getTotalUser = async (stDate, enDate, roleId, hotelId) => {
    try {
        const start = new Date(stDate);
        const end = new Date(enDate);
        end.setHours(23, 59, 59, 999);
        const query = {
            createdAt: { $gte: new Date(start), $lt: new Date(end) }
        }
        if (roleId == 2 || roleId == 3) {
            query.hotelId = hotelId;
        }
        const users = await BookingUser.find(query).countDocuments().exec();
        return users
    } catch (ex) {
        return 0
    }
}

const getTop5EntertainmentData = async (startDate, endDate, roleId, hotelId) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        // console.log(hotelId, 'hotelId..')
        // console.log(startDate, "startDate")
        const matchStage = {
            createdAt: { $gte: start, $lt: end },
        };

        if (roleId === 2 || roleId === 3) {
            matchStage.hotelId = new mongoose.Types.ObjectId(hotelId);
        }

        const data = await UserRequiremnet.aggregate([
            // {
            //     $match: {
            //         hotelId: new mongoose.Types.ObjectId(hotelId),
            //         createdAt: { $gte: startDate,  $lte: endDate }, // Filter interactions within the specified date range
            //     }
            // },
            {
                $match: matchStage
            },
            {
                $unwind: "$entertainmentComposition"
            },
            {
                $group: {
                    _id: "$entertainmentComposition",
                    occurrences: { $sum: 1 }
                }
            },
            {
                $sort: { occurrences: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "entertainmentitems", // Replace with the actual name of your referenced collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'data'
                }
            },

        ]).exec();
        console.log(data, "data")

        return data
    } catch (ex) {
        return {}
    }
}

const getTop5DecorData = async (startDate, endDate, roleId, hotelId) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const matchStage = {
            createdAt: { $gte: start, $lt: end },
        };

        if (roleId === 2 || roleId === 3) {
            matchStage.hotelId = new mongoose.Types.ObjectId(hotelId);
        }

        const data = await UserRequiremnet.aggregate([
            // {
            //     $match: {
            //         createdAt: { $gte: startDate,  $lte: endDate } // Filter interactions within the specified date range
            //     }
            // },
            {
                $match: matchStage
            },
            {
                $unwind: "$decorComposition"
            },
            {
                $group: {
                    _id: "$decorComposition",
                    occurrences: { $sum: 1 }
                }
            },
            {
                $sort: { occurrences: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "decoritems", // Replace with the actual name of your referenced collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'data'
                }
            },

        ]).exec();
        return data
    } catch (ex) {
        return {}
    }
}

const getTop5FoodData = async (startDate, endDate, roleId, hotelId) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const matchStage = {
            createdAt: { $gte: start, $lt: end },
        };

        if (roleId === 2 || roleId === 3) {
            matchStage.hotelId = new mongoose.Types.ObjectId(hotelId);
        }
        const data = await UserRequiremnet.aggregate([
            {
                $match: matchStage
            },
            {
                $unwind: "$composition"
            },
            {
                $group: {
                    _id: "$composition",
                    occurrences: { $sum: 1 }
                }
            },
            {
                $sort: { occurrences: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "newfooditems", // Replace with the actual name of your referenced collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'data'
                }
            },

        ]).exec();
        return data
    } catch (ex) {
        return {}
    }
}

const getTop5Venue = async (startDate, endDate, roleId, hotelId) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const matchStage = {
            createdAt: { $gte: start, $lt: end },
        };

        if (roleId === 2 || roleId === 3) {
            matchStage.hotelId = new mongoose.Types.ObjectId(hotelId);
        }
        const data = await UserRequiremnet.aggregate([
            {
                $match: matchStage
            },
            {
                $group: {
                    _id: "$venue",
                    occurrences: { $sum: 1 }
                }
            },
            {
                $sort: { occurrences: -1 }
            },
            {
                $limit: 5
            }

        ]).exec();
        return data
    } catch (ex) {
        console.log(ex, "error")
        return {}
    }
}

const getTop5HotelData = async (startDate, endDate, roleId, hotelId) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const matchStage = {
            createdAt: { $gte: start, $lt: end },
        };

        if (roleId === 2 || roleId === 3) {
            matchStage.hotelId = new mongoose.Types.ObjectId(hotelId);
        }
        const data = await UserRequiremnet.aggregate([
            {
                $match: matchStage
            },
            {
                $group: {
                    _id: { event: "$event", hotelId: "$hotelId" },
                    occurrences: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.hotelId",
                    events: { $push: { event: "$_id.event", occurrences: "$occurrences" } }
                }
            },
            {
                $lookup: {
                    from: "hotels",
                    localField: '_id',
                    foreignField: '_id',
                    as: 'data'
                }
            },
            {
                $project: {
                    "data.hotelName": 1,
                    events: 1,
                    occurances: 1
                }
            }
        ]).exec();
        return data

    } catch (ex) {
        return {}
    }
}

const getCurateEventCount = async (startDate, endDate, roleId, hotelId) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const query = {
            createdAt: { $gte: new Date(start), $lt: new Date(end) }
        };

        if (roleId === 2 || roleId === 3) {
            query.hotelId = new mongoose.Types.ObjectId(hotelId);
        }
        const count = await UserRequiremnet.find(query).count().exec();
        return count
    } catch (ex) {

    }
}

const getDeviceData = async (startDate, endDate, roleId, hotelId) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const query = {
            action: "Login",
            createdAt: { $gte: new Date(start), $lt: new Date(end) },
        }
        if (roleId == 2 || roleId == 3) {
            query.hotel = new mongoose.Types.ObjectId(hotelId);
        }

        const data = await Interaction.find(query).exec();
        return data
    } catch (ex) {
        return []
    }
}

const getAllUserInteraction = async (startDate, endDate, roleId, hotelId) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const matchStage = {
            createdAt: { $gte: start, $lt: end },
        };

        if (roleId === 2 || roleId === 3) {
            matchStage.hotel = new mongoose.Types.ObjectId(hotelId);
        }

        const data = await Interaction.aggregate([
            {
                $match: matchStage
            },
            {
                $sort: { "createdAt": 1 } // Sort interactions by createdAt timestamp in ascending order
            },
            {
                $group: {
                    _id: "$user",
                    interactions: { $push: "$$ROOT" } // Push all interactions into an array for each user
                }
            },
            {
                $project: {
                    userId: "$_id",
                    totalTimeSpent: {
                        $reduce: {
                            input: {
                                $filter: {
                                    input: "$interactions",
                                    as: "interaction",
                                    cond: {
                                        $or: [
                                            { $eq: [{ $indexOfArray: ["$interactions", "$$interaction"] }, 0] }, // Include the first interaction
                                            { $lt: [{ $subtract: ["$$interaction.createdAt", { $arrayElemAt: ["$interactions.createdAt", { $subtract: [{ $indexOfArray: ["$interactions", "$$interaction"] }, 1] }] }] }, 20 * 60 * 1000] } // Check if time gap is less than or equal to 20 minutes
                                        ]
                                    }
                                }
                            },
                            initialValue: 0,
                            in: {
                                $cond: [
                                    { $gt: [{ $indexOfArray: ["$interactions", "$$this"] }, 0] }, // Check if it's not the first interaction
                                    { $add: ["$$value", { $subtract: ["$$this.createdAt", { $arrayElemAt: ["$interactions.createdAt", { $subtract: [{ $indexOfArray: ["$interactions", "$$this"] }, 1] }] }] }] }, // Calculate time difference
                                    0
                                ]
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalTimeSpent" }, // Sum up total time spent for all users
                    count: { $sum: 1 } // Count the number of users
                }
            },
            {
                $project: {
                    averageTimeSpent: { $divide: ["$total", { $multiply: ["$count", 1000 * 60] }] } // Calculate average time spent
                }
            }
        ])
        if (data.length > 0 && data[0]?.averageTimeSpent) return data[0]?.averageTimeSpent
        return 0
    } catch (ex) {
        return 0
    }
}

const getAllUserRoomInteraction = async (startDate, endDate, roleId, hotelId) => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const query = {
            action: "Room change",
            value: { $ne: "droneView" },
            // createdAt: { $gte: new Date(startDate),   $lte: new Date(endDate) }
            createdAt: { $gte: start, $lt: end }


        }
        if (roleId === 2 || roleId === 3) {
            query.hotel = new mongoose.Types.ObjectId(hotelId);
        }
        const data = await Interaction.aggregate([

            {
                $match: query
            },
            {
                "$sort": {
                    "createdAt": 1
                }
            },
            {
                "$group": {
                    "_id": {
                        "userId": "$user",
                        "value": "$value",

                    },
                    "interactions": {
                        "$push": "$$ROOT"
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "userId": "$_id.userId",
                    "value": "$_id.value",
                    "hotelId": {
                        "$arrayElemAt": ["$interactions.hotelId", 0] // Accessing the first element of the array
                    },
                    "totalTimeSpent": {
                        "$reduce": {
                            "input": {
                                "$filter": {
                                    "input": "$interactions",
                                    "as": "interaction",
                                    "cond": {
                                        "$or": [
                                            { "$eq": [{ "$indexOfArray": ["$interactions", "$$interaction"] }, 0] },
                                            { "  $lt": [{ "$subtract": ["$$interaction.createdAt", { "$arrayElemAt": ["$interactions.createdAt", { "$subtract": [{ "$indexOfArray": ["$interactions", "$$interaction"] }, 1] }] }] }, 20 * 60 * 1000] }
                                        ]
                                    }
                                }
                            },
                            "initialValue": 0,
                            "in": {
                                "$cond": [
                                    { "$gt": [{ "$indexOfArray": ["$interactions", "$$this"] }, 0] },
                                    { "$add": ["$$value", { "$subtract": ["$$this.createdAt", { "$arrayElemAt": ["$interactions.createdAt", { "$subtract": [{ "$indexOfArray": ["$interactions", "$$this"] }, 1] }] }] }] },
                                    0
                                ]
                            }
                        }
                    }
                }
            },
            {
                "$group": {
                    "_id": { "value": "$value", "hotelId": "$hotelId" },
                    "totalTimeSpent": { "$sum": "$totalTimeSpent" },

                }
            },
            {
                "$sort": {
                    "totalTimeSpent": -1
                }
            },
            {
                "$limit": 5
            },
            {
                $lookup: {
                    from: "hotels",
                    localField: '_id.hotelId',
                    foreignField: '_id',
                    as: 'data'
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "value": "$_id.value",
                    "totalTimeSpent": "$totalTimeSpent",
                    "hotel": "$data.hotelName"
                }
            },

        ]


        )
        return data
    } catch (ex) {
        return 0
    }
}

// const getDistinctUser = async (stDate, enDate, roleId, hotelId) => {
//     try {
//         const users = await BookingUser.distinct('email').exec();
//         return users?.length
//     } catch (ex) {
//         return 0
//     }
// }

// const getTotalUser = async (stDate, enDate, roleId, hotelId) => {
//     try {
//         const users = await BookingUser.find().count().exec();
//         return users
//     } catch (ex) {
//         return 0
//     }
// }

// const getTop5EntertainmentData = async (startDate, endDate, roleId, hotelId) => {
//     try {
//         const data = await UserRequiremnet.aggregate([
//             {
//                 $match: {
//                     createdAt: { $gte: startDate,   $lte: endDate } // Filter interactions within the specified date range
//                 }
//             },
//             {
//                 $unwind: "$entertainmentComposition"
//             },
//             {
//                 $group: {
//                     _id: "$entertainmentComposition",
//                     occurrences: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: { occurrences: -1 }
//             },
//             {
//                 $limit: 5
//             },
//             {
//                 $lookup: {
//                     from: "entertainmentitems", // Replace with the actual name of your referenced collection
//                     localField: '_id',
//                     foreignField: '_id',
//                     as: 'data'
//                 }
//             },

//         ]).exec();
//         return data
//     } catch (ex) {
//         return {}
//     }
// }

// const getTop5DecorData = async (startDate, endDate, roleId, hotelId) => {
//     try {
//         const data = await UserRequiremnet.aggregate([
//             {
//                 $match: {
//                     createdAt: { $gte: startDate,   $lte: endDate } // Filter interactions within the specified date range
//                 }
//             },
//             {
//                 $unwind: "$decorComposition"
//             },
//             {
//                 $group: {
//                     _id: "$decorComposition",
//                     occurrences: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: { occurrences: -1 }
//             },
//             {
//                 $limit: 5
//             },
//             {
//                 $lookup: {
//                     from: "decoritems", // Replace with the actual name of your referenced collection
//                     localField: '_id',
//                     foreignField: '_id',
//                     as: 'data'
//                 }
//             },

//         ]).exec();
//         return data
//     } catch (ex) {
//         return {}
//     }
// }

// const getTop5FoodData = async (startDate, endDate, roleId, hotelId) => {
//     try {
//         const data = await UserRequiremnet.aggregate([
//             {
//                 $match: {
//                     createdAt: { $gte: startDate,   $lte: endDate } // Filter interactions within the specified date range
//                 }
//             },
//             {
//                 $unwind: "$composition"
//             },
//             {
//                 $group: {
//                     _id: "$composition",
//                     occurrences: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: { occurrences: -1 }
//             },
//             {
//                 $limit: 5
//             },
//             {
//                 $lookup: {
//                     from: "newfooditems", // Replace with the actual name of your referenced collection
//                     localField: '_id',
//                     foreignField: '_id',
//                     as: 'data'
//                 }
//             },

//         ]).exec();
//         return data
//     } catch (ex) {
//         return {}
//     }
// }

// const getTop5Venue = async (startDate, endDate, roleId, hotelId) => {
//     try {
//         const data = await UserRequiremnet.aggregate([
//             {
//                 $match: {
//                     createdAt: { $gte: startDate,   $lte: endDate } // Filter interactions within the specified date range
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$venue",
//                     occurrences: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: { occurrences: -1 }
//             },
//             {
//                 $limit: 5
//             }

//         ]).exec();
//         return data
//     } catch (ex) {
//         console.log(ex, "error")
//         return {}
//     }
// }

// const getTop5HotelData = async (startDate, endDate, roleId, hotelId) => {
//     try {
//         const data = await UserRequiremnet.aggregate([
//             {
//                 $match: {
//                     createdAt: { $gte: startDate,   $lte: endDate } // Filter interactions within the specified date range
//                 }
//             },
//             {
//                 $group: {
//                     _id: { event: "$event", hotelId: "$hotelId" },
//                     occurrences: { $sum: 1 }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$_id.hotelId",
//                     events: { $push: { event: "$_id.event", occurrences: "$occurrences" } }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "hotels",
//                     localField: '_id',
//                     foreignField: '_id',
//                     as: 'data'
//                 }
//             },
//             {
//                 $project: {
//                     "data.hotelName": 1,
//                     events: 1,
//                     occurances: 1
//                 }
//             }
//         ]).exec();
//         return data

//     } catch (ex) {
//         return {}
//     }
// }

// const getCurateEventCount = async (startDate, endDate, roleId, hotelId) => {
//     try {
//         const count = await UserRequiremnet.find({
//             createdAt: {  $lte: endDate, $gte: startDate }
//         }).count().exec();
//         return count
//     } catch (ex) {

//     }
// }

// const getDeviceData = async (startDate, endDate, roleId, hotelId) => {
//     try {
//         const data = await Interaction.find({
//             action: "Login",
//             createdAt: {  $lte: endDate, $gte: startDate }
//         }
//         ).exec();
//         //console.log(data,"data")
//         return data
//     } catch (ex) {
//         return []
//     }
// }

// const getAllUserInteraction = async (startDate, endDate, roleId, hotelId) => {
//     try {
//         const data = await Interaction.aggregate([
//             {
//                 $match: {
//                     createdAt: { $gte: startDate,  $lte: endDate } // Filter interactions within the specified date range
//                 }
//             },
//             {
//                 $sort: { "createdAt": 1 } // Sort interactions by createdAt timestamp in ascending order
//             },
//             {
//                 $group: {
//                     _id: "$user",
//                     interactions: { $push: "$$ROOT" } // Push all interactions into an array for each user
//                 }
//             },
//             {
//                 $project: {
//                     userId: "$_id",
//                     totalTimeSpent: {
//                         $reduce: {
//                             input: {
//                                 $filter: {
//                                     input: "$interactions",
//                                     as: "interaction",
//                                     cond: {
//                                         $or: [
//                                             { $eq: [{ $indexOfArray: ["$interactions", "$$interaction"] }, 0] }, // Include the first interaction
//                                             {  $lte: [{ $subtract: ["$$interaction.createdAt", { $arrayElemAt: ["$interactions.createdAt", { $subtract: [{ $indexOfArray: ["$interactions", "$$interaction"] }, 1] }] }] }, 20 * 60 * 1000] } // Check if time gap is less than or equal to 20 minutes
//                                         ]
//                                     }
//                                 }
//                             },
//                             initialValue: 0,
//                             in: {
//                                 $cond: [
//                                     { $gt: [{ $indexOfArray: ["$interactions", "$$this"] }, 0] }, // Check if it's not the first interaction
//                                     { $add: ["$$value", { $subtract: ["$$this.createdAt", { $arrayElemAt: ["$interactions.createdAt", { $subtract: [{ $indexOfArray: ["$interactions", "$$this"] }, 1] }] }] }] }, // Calculate time difference
//                                     0
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     total: { $sum: "$totalTimeSpent" }, // Sum up total time spent for all users
//                     count: { $sum: 1 } // Count the number of users
//                 }
//             },
//             {
//                 $project: {
//                     averageTimeSpent: { $divide: ["$total", { $multiply: ["$count", 1000 * 60] }] } // Calculate average time spent
//                 }
//             }
//         ])
//         if (data.length > 0 && data[0]?.averageTimeSpent) return data[0]?.averageTimeSpent
//         return 0
//     } catch (ex) {
//         return 0
//     }
// }

// const getAllUserRoomInteraction = async (startDate, endDate, roleId, hotelId) => {
//     try {
//         const data = await Interaction.aggregate([
//             {
//                 "$match": {
//                     "action": "Room change",
//                     "value": {
//                         "$ne": "droneView"
//                     },

//                     createdAt: { $gte: startDate,  $lte: endDate } // Filter interactions within the specified date range
//                 },

//             },
//             {
//                 "$sort": {
//                     "createdAt": 1
//                 }
//             },
//             {
//                 "$group": {
//                     "_id": {
//                         "userId": "$user",
//                         "value": "$value",

//                     },
//                     "interactions": {
//                         "$push": "$$ROOT"
//                     }
//                 }
//             },
//             {
//                 "$project": {
//                     "_id": 0,
//                     "userId": "$_id.userId",
//                     "value": "$_id.value",
//                     "hotelId": {
//                         "$arrayElemAt": ["$interactions.hotelId", 0] // Accessing the first element of the array
//                     },
//                     "totalTimeSpent": {
//                         "$reduce": {
//                             "input": {
//                                 "$filter": {
//                                     "input": "$interactions",
//                                     "as": "interaction",
//                                     "cond": {
//                                         "$or": [
//                                             { "$eq": [{ "$indexOfArray": ["$interactions", "$$interaction"] }, 0] },
//                                             { " $lte": [{ "$subtract": ["$$interaction.createdAt", { "$arrayElemAt": ["$interactions.createdAt", { "$subtract": [{ "$indexOfArray": ["$interactions", "$$interaction"] }, 1] }] }] }, 20 * 60 * 1000] }
//                                         ]
//                                     }
//                                 }
//                             },
//                             "initialValue": 0,
//                             "in": {
//                                 "$cond": [
//                                     { "$gt": [{ "$indexOfArray": ["$interactions", "$$this"] }, 0] },
//                                     { "$add": ["$$value", { "$subtract": ["$$this.createdAt", { "$arrayElemAt": ["$interactions.createdAt", { "$subtract": [{ "$indexOfArray": ["$interactions", "$$this"] }, 1] }] }] }] },
//                                     0
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 "$group": {
//                     "_id": { "value": "$value", "hotelId": "$hotelId" },
//                     "totalTimeSpent": { "$sum": "$totalTimeSpent" },

//                 }
//             },
//             {
//                 "$sort": {
//                     "totalTimeSpent": -1
//                 }
//             },
//             {
//                 "$limit": 5
//             },
//             {
//                 $lookup: {
//                     from: "hotels",
//                     localField: '_id.hotelId',
//                     foreignField: '_id',
//                     as: 'data'
//                 }
//             },
//             {
//                 "$project": {
//                     "_id": 0,
//                     "value": "$_id.value",
//                     "totalTimeSpent": "$totalTimeSpent",
//                     "hotel": "$data.hotelName"
//                 }
//             },

//         ]


//         )
//         return data
//     } catch (ex) {
//         return 0
//     }
// }

const getTop5allData = async (req, res) => {
    try {
        const { adminData } = req;
        const { user_id, roleId, hotelId } = adminData;
        // console.log(user_id, roleId, hotelId, "user_role")
        const { stDate, enDate } = req.params;
        const dates = changeDateFormat(stDate, enDate);
        //console.log(stDate,enDate,"dates")
        //console.log(start,end,"dates")
        const [ent, dec, food, venue, hotel, user, distinctuser, curateEvent, devices, avgTime, roomData] =
            await Promise.all([
                getTop5EntertainmentData(dates.start, dates.end, roleId, hotelId),
                getTop5DecorData(dates.start, dates.end, roleId, hotelId),
                getTop5FoodData(dates.start, dates.end, roleId, hotelId),
                getTop5Venue(dates.start, dates.end, roleId, hotelId),
                getTop5HotelData(dates.start, dates.end, roleId, hotelId),
                getTotalUser(dates.start, dates.end, roleId, hotelId),
                getDistinctUser(dates.start, dates.end, roleId, hotelId),
                getCurateEventCount(dates.start, dates.end, roleId, hotelId),
                // Done till here
                getDeviceData(dates.start, dates.end, roleId, hotelId),
                getAllUserInteraction(dates.start, dates.end, roleId, hotelId),
                getAllUserRoomInteraction(dates.start, dates.end, roleId, hotelId)
            ]);
        const data = {
            ent, dec, food, venue, hotel, user, distinctuser, curateEvent, devices, avgTime, roomData
        }
        var rs = new iResponse(HTTPCodes.SUCCESS, data);
        rs.msg = "Item saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "Users", "Users exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
}

const getTop5Food = async (req, res) => {
    try {
        const { adminData } = req;
        const { user_id, roleId, hotelId } = adminData;
        const { stDate, enDate } = req.params;
        const dates = changeDateFormat(stDate, enDate);
        const data = await getTop5FoodData(dates.start, dates.end, roleId, hotelId);
        var rs = new iResponse(HTTPCodes.SUCCESS, data);
        rs.msg = "Item saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "Users", "Users exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
}

const getTop5Ent = async (req, res) => {
    try {
        const { adminData } = req;
        const { user_id, roleId, hotelId } = adminData;
        const { stDate, enDate } = req.params;
        const dates = changeDateFormat(stDate, enDate);
        const data = await getTop5EntertainmentData(dates.start, dates.end, roleId, hotelId);
        var rs = new iResponse(HTTPCodes.SUCCESS, data);
        rs.msg = "Item saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "Users", "Users exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
}

const getTop5VenueData = async (req, res) => {
    try {
        const { stDate, enDate } = req.params;
        const { adminData } = req;
        const { user_id, roleId, hotelId } = adminData;
        const dates = changeDateFormat(stDate, enDate);
        const data = await getTop5Venue(dates.start, dates.end, roleId, hotelId);
        var rs = new iResponse(HTTPCodes.SUCCESS, data);
        rs.msg = "Item saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "Users", "Users exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
}

const getTop5Decor = async (req, res) => {
    try {
        const { adminData } = req;
        const { user_id, roleId, hotelId } = adminData;
        const { stDate, enDate } = req.params;
        const dates = changeDateFormat(stDate, enDate);
        const data = await getTop5DecorData(dates.start, dates.end, roleId, hotelId);
        var rs = new iResponse(HTTPCodes.SUCCESS, data);
        rs.msg = "Item saved Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "Users", "Users exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
}

const getUtsSourceData = async (req, res) => {
    try {
        const { stDate, enDate } = req.params;
        const { adminData } = req;
        const { user_id, roleId, hotelId } = adminData;
        const dates = changeDateFormat(stDate, enDate);

        let query = {
            createdAt: { $gte: dates.start, $lte: dates.end }
        };

        if (roleId !== 1) {
            query.hotelId = hotelId;
        }

        const utmSourcesData = await BookingUser.aggregate([
            { $match: query },
            {
                $group: {
                    _id: { $ifNull: ["$utmFields.utmSource", "directlyWebsite"] }, // Replace null with "directlyWebsite"
                    count: { $sum: 1 }
                }
            }
        ]);

        const responseData = {
            uniqueUtmSourceCount: utmSourcesData.length,
            utmSourcesWithCounts: utmSourcesData
        };

        var rs = new iResponse(HTTPCodes.SUCCESS, responseData);
        rs.msg = "UTM Source Data Fetched Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        logging.error(NAMESPACE, "Booking Users Exception", "Booking Users Exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
}

const loggedInUsersListOld = async (req, res) => {
    try {
        const { stDate, enDate } = req.params;
        const start = new Date(stDate);
        const end = new Date(enDate);
        end.setHours(23, 59, 59, 999);

        const { adminData } = req;
        const { roleId, hotelId } = adminData;

        let query = [
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            ...(roleId !== 1 ? [{ $match: { hotelId: hotelId } }] : []),
            {
                $lookup: {
                    from: 'interactions',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'interactions'
                }
            },
            {
                $lookup: {
                    from: 'hotels',
                    localField: 'hotelId',
                    foreignField: '_id',
                    as: 'hotelDetails'
                }
            },
            {
                $addFields: {
                    browserData: {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$interactions",
                                            as: "interaction",
                                            cond: { $eq: ["$$interaction.action", "Login"] }
                                        }
                                    },
                                    as: "loginInteraction",
                                    in: "$$loginInteraction.value"
                                }
                            },
                            0
                        ]
                    },
                    userJourney: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$interactions",
                                    as: "interaction",
                                    cond: { $eq: ["$$interaction.action", "Room change"] }
                                }
                            },
                            as: "roomChangeInteraction",
                            in: "$$roomChangeInteraction.value" // Only store the value, not the entire interaction
                        }
                    },
                    // Add fields for button clicked and form submission status
                    planMyEventClicked: {
                        $in: [
                            "Button Clicked",
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$interactions",
                                            as: "interaction",
                                            cond: {
                                                $and: [
                                                    { $eq: ["$$interaction.value", "curateEvent"] },
                                                    { $eq: ["$$interaction.action", "Button Clicked"] }
                                                ]
                                            }
                                        }
                                    },
                                    as: "interaction",
                                    in: "$$interaction.action"
                                }
                            }
                        ]
                    },
                    planMyEventSubmitted: {
                        $in: [
                            "Form Final Submission",
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$interactions",
                                            as: "interaction",
                                            cond: { $eq: ["$$interaction.action", "Form Final Submission"] }
                                        }
                                    },
                                    as: "interaction",
                                    in: "$$interaction.action"
                                }
                            }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    userJourney: {
                        $sortArray: {
                            input: "$userJourney",
                            sortBy: { createdAt: -1 }  // Sort by createdAt in descending order
                        }
                    },
                    totalTimeSpent: {
                        $divide: [
                            {
                                $sum: {
                                    $map: {
                                        input: { $range: [0, { $subtract: [{ $size: "$interactions" }, 1] }] },
                                        as: "i",
                                        in: {
                                            $let: {
                                                vars: {
                                                    timeDiff: {
                                                        $subtract: [
                                                            { $arrayElemAt: ["$interactions.createdAt", { $add: ["$$i", 1] }] },
                                                            { $arrayElemAt: ["$interactions.createdAt", "$$i"] }
                                                        ]
                                                    }
                                                },
                                                in: {
                                                    $cond: [
                                                        { $lte: ["$$timeDiff", 600000] },
                                                        "$$timeDiff",
                                                        0
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            1000 * 60 // Convert from ms to minutes
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    hotelId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    utmFields: 1,
                    hotelName: { $arrayElemAt: ['$hotelDetails.hotelName', 0] },
                    hotelAddress: { $arrayElemAt: ['$hotelDetails.address', 0] },
                    hotelLocation: { $arrayElemAt: ['$hotelDetails.location', 0] },
                    friendlyName: { $arrayElemAt: ['$hotelDetails.friendlyName', 0] },
                    contactNo: { $arrayElemAt: ['$hotelDetails.contactNo', 0] },
                    contactInfo: { $arrayElemAt: ['$hotelDetails.contactInfo', 0] },
                    interactions: 1,
                    browserData: 1,
                    userJourney: 1,
                    totalTimeSpent: 1,
                    planMyEventClicked: 1,
                    planMyEventSubmitted: 1
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ];

        const usersWithInteractions = await BookingUser.aggregate(query);

        console.log(usersWithInteractions, "usersWithInteractions");

        const rs = new iResponse(HTTPCodes.SUCCESS, usersWithInteractions);
        rs.msg = "Data Fetched Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);

    } catch (ex) {
        logging.error(NAMESPACE, "Booking Users Exception", "Booking Users Exception", ex);
        const rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const loggedInUsersList = async (req, res) => {
    try {
        const { stDate, enDate } = req.params;
        const start = new Date(stDate);
        const end = new Date(enDate);
        end.setHours(23, 59, 59, 999);

        const { adminData } = req;
        const { roleId, hotelId } = adminData;

        let query = [
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            ...(roleId !== 1 ? [{ $match: { hotelId: hotelId } }] : []),
            {
                $lookup: {
                    from: 'interactions',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'interactions'
                }
            },
            {
                $lookup: {
                    from: 'hotels',
                    localField: 'hotelId',
                    foreignField: '_id',
                    as: 'hotelDetails'
                }
            },
            {
                $addFields: {
                    browserData: {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$interactions",
                                            as: "interaction",
                                            cond: { $eq: ["$$interaction.action", "Login"] }
                                        }
                                    },
                                    as: "loginInteraction",
                                    in: "$$loginInteraction.value"
                                }
                            },
                            0
                        ]
                    },
                    userJourney: {
                        $map: {
                            input: "$interactions",
                            as: "interaction",
                            in: {
                                $cond: [
                                    { $eq: ["$$interaction.action", "Room change"] },
                                    "$$interaction.value", // Include value for "Room change"
                                    {
                                        $cond: [
                                            { $eq: ["$$interaction.action", "Button Clicked"] },
                                            "$$interaction.value", // Include value for "Button Clicked"
                                            "$$interaction.action" // Otherwise, include the action itself
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    // Add fields for button clicked and form submission status
                    planMyEventClicked: {
                        $in: [
                            "Button Clicked",
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$interactions",
                                            as: "interaction",
                                            cond: {
                                                $and: [
                                                    { $eq: ["$$interaction.value", "curateEvent"] },
                                                    { $eq: ["$$interaction.action", "Button Clicked"] }
                                                ]
                                            }
                                        }
                                    },
                                    as: "interaction",
                                    in: "$$interaction.action"
                                }
                            }
                        ]
                    },
                    planMyEventSubmitted: {
                        $in: [
                            "Form Final Submission",
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$interactions",
                                            as: "interaction",
                                            cond: { $eq: ["$$interaction.action", "Form Final Submission"] }
                                        }
                                    },
                                    as: "interaction",
                                    in: "$$interaction.action"
                                }
                            }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    userJourney: {
                        $sortArray: {
                            input: "$userJourney",
                            sortBy: { createdAt: -1 } // Ensure sorting if necessary
                        }
                    },
                    totalTimeSpent: {
                        $divide: [
                            {
                                $sum: {
                                    $map: {
                                        input: { $range: [0, { $subtract: [{ $size: "$interactions" }, 1] }] },
                                        as: "i",
                                        in: {
                                            $let: {
                                                vars: {
                                                    timeDiff: {
                                                        $subtract: [
                                                            { $arrayElemAt: ["$interactions.createdAt", { $add: ["$$i", 1] }] },
                                                            { $arrayElemAt: ["$interactions.createdAt", "$$i"] }
                                                        ]
                                                    }
                                                },
                                                in: {
                                                    $cond: [
                                                        { $lte: ["$$timeDiff", 600000] },
                                                        "$$timeDiff",
                                                        0
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            1000 * 60 // Convert from ms to minutes
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    hotelId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    utmFields: 1,
                    hotelName: { $arrayElemAt: ['$hotelDetails.hotelName', 0] },
                    hotelAddress: { $arrayElemAt: ['$hotelDetails.address', 0] },
                    hotelLocation: { $arrayElemAt: ['$hotelDetails.location', 0] },
                    friendlyName: { $arrayElemAt: ['$hotelDetails.friendlyName', 0] },
                    contactNo: { $arrayElemAt: ['$hotelDetails.contactNo', 0] },
                    contactInfo: { $arrayElemAt: ['$hotelDetails.contactInfo', 0] },
                    interactions: 1,
                    browserData: 1,
                    userJourney: 1,
                    totalTimeSpent: 1,
                    planMyEventClicked: 1,
                    planMyEventSubmitted: 1
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ];

        const usersWithInteractions = await BookingUser.aggregate(query);

        console.log(usersWithInteractions, "usersWithInteractions");

        const rs = new iResponse(HTTPCodes.SUCCESS, usersWithInteractions);
        rs.msg = "Data Fetched Successfully";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);

    } catch (ex) {
        logging.error(NAMESPACE, "Booking Users Exception", "Booking Users Exception", ex);
        const rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};


module.exports = {
    Login,
    ForgotPassword,
    ResetPassword,
    FoodCateListAll,
    FoodCateData,
    FoodCateList,
    FoodCateDel,
    FoodCateUpd,
    DecorCateListAll,
    DecorCateList,
    DecorCateData,
    DecorCateUpd,
    DecorCateDel,
    EntertainCateListAll,
    EntertainCateList,
    EntertainCateData,
    EntertainCateUpd,
    EntertainCateDel,
    EntertainmentById,
    WeddCateListAll,
    WeddCateList,
    WeddCateData,
    WeddCateUpd,
    WeddCateDel,
    FoodList,
    FoodDataNew,
    Foodupd,
    FoodDel,
    FoodById,
    DecorList,
    DecorDataNew,
    Decorupd,
    DecorDel,
    DecorCateListAll,
    DecorById,
    EntertainmentList,
    EntertainmentDataNew,
    Entertainmentupd,
    EntertainmentDel,
    GetAllHotels,
    SaveHotel,
    GetHotelById,
    DeleteHotelById,
    EditHotelInfo,
    UpdateHotelInfo,
    GetAllRooms,
    SaveNewRoom,
    EditHotelRoom,
    UpdateHotelRoom,
    DeleteHotelRoom,
    DeleteFoodPackage,
    UpdateFoodPackage,
    FoodPackageById,
    SaveFoodPackage,
    FoodpackageByHotelId,
    UserRequirements,
    UserRequirement,
    UserRequirementById,
    Users,
    GetAllHotels1,
    FoodListByHotelId,
    FoodpackageByHotelId2,
    GetDecorByHotelId,
    EntertainmentList1,
    addUser,
    updateUser,
    deleteUser,
    GetAllRooms1,
    getUserData,
    getTop5allData,
    getTop5Food,
    getTop5Ent,
    getTop5VenueData,
    getTop5Decor,
    getDistinctUser,
    getTop5HotelData,
    loggedInUsersList,
    getUtsSourceData
};
