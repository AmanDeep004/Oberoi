var jwt = require("jsonwebtoken");
const NAMESPACE = "Authenticator"
const logging = require("../helpers/logging");
const { EnumUserRoles } = require("../helpers/constants")
const User = require("../models/user");
const { HTTPCodes, iResponse } = require("../helpers/Common");
const BookingUser = require("../models/bookingUser");
/** for checking  Admin starts*/
function AuthAdmin(req, res, next) {
    try {
        logging.info(NAMESPACE, "AuthAdmin", "AuthAdmin called");
        const bearerHeader = req.headers.token;
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ");
            const token = bearer[1];
            req.token = token;
            jwt.verify(req.token, process.env.TOKEN_KEY, async (err, authData) => {
                if (err) {
                    var rs = new iResponse(HTTPCodes.ERROR, {});
                    rs.msg = "Invalid Token.Please login again"
                    return res.status(HTTPCodes.ERROR.status).json(rs);
                } else {
                    var user = await User.findOne({ email: authData.email }).exec();
                    if (user) {
                        if (user.roleId == EnumUserRoles.SuperAdmin || user.roleId == EnumUserRoles.Gm || user.roleId == EnumUserRoles.SalesTeam) {
                            req.adminId = authData.id;
                            req.adminData = authData;
                            next()
                        }
                        else {
                            var rs = new iResponse(HTTPCodes.METHODNOTALLOWED, {})
                            rs.msg = "You are not admin";
                            return res.status(HTTPCodes.METHODNOTALLOWED.status).json(rs);
                        }
                    }
                    else {
                        var rs = new iResponse(HTTPCodes.BADREQUEST, {})
                        rs.msg = "Something went worng";
                        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
                    }
                }
            })
        } else {
            //res.send({ result: "Token Is invalid" });
            var rs = new iResponse(HTTPCodes.BADREQUEST, {})
            rs.msg = "Token Is invalid";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
    } catch (ex) {
        logging.error(NAMESPACE, "AuthAdmin", "AuthAdmin called exception", ex);
        return res.status(HTTPCodes.ERROR.status).json(new iResponse(HTTPCodes.ERROR, ex.message));
    }
};


/** for checking  User starts*/ //process.env.TOKEN_KEY
function AuthUser(req, res, next) {
    try {
        logging.info(NAMESPACE, "AuthUser", "AuthUser called");
        const bearerHeader = req.headers.token;
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ");
            const token = bearer[1];
            req.token = token;
            // jwt.verify(req.token, "secretToken", async (err, authData) => {
            jwt.verify(req.token, process.env.SECRET_TOKEN, async (err, authData) => {
                if (err) {
                    var rs = new iResponse(HTTPCodes.ERROR, {});
                    rs.msg = "Invalid Token.Please login again"
                    return res.status(HTTPCodes.ERROR.status).json(rs);
                } else {
                    var user = await BookingUser.findOne({ _id: authData.UserInfo.id }).sort({ createdAt: -1 }).exec();
                    console.log("user", user);
                    if (user) {
                        if (user.roleId == EnumUserRoles.User) {
                            req.UserInfo = authData.UserInfo;
                            //req.adminData = authData;
                            next()
                        }
                        else {
                            var rs = new iResponse(HTTPCodes.METHODNOTALLOWED, {})
                            rs.msg = "You are not authenticated user";
                            return res.status(HTTPCodes.METHODNOTALLOWED.status).json(rs);
                        }
                    }
                    else {
                        var rs = new iResponse(HTTPCodes.BADREQUEST, {})
                        rs.msg = "User Not found";
                        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
                    }
                }
            })
        } else {
            var rs = new iResponse(HTTPCodes.BADREQUEST, {})
            rs.msg = "Token Is invalid";
            return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        }
    } catch (ex) {
        logging.error(NAMESPACE, "AuthUser", "AuthUser called exception", ex);
        return res.status(HTTPCodes.ERROR.status).json(new iResponse(HTTPCodes.ERROR, ex.message));
    }
};

module.exports = {
    AuthAdmin, AuthUser
}