const { EnumUserRoles } = require("../helpers/constants");
const logging = require("../helpers/logging");
const Hotels = require("../models/hotel");
const User = require("../models/user");
const { HTTPCodes, iResponse } = require("../helpers/Common");
var jwt = require("jsonwebtoken");
const NAMESPACE = "LOGIN Controller";

//** Route Handlers aka actionMethods */
const Login = async (req, res) => {
    try {
        logging.info(NAMESPACE, "LOGIN", "Request Login", req.body);
        const { email, password } = req.body;

        var user = await User.findOne({
            email: req.body.email.toLowerCase(),
        }).exec();
        if (!user) {
            return res.status(HTTPCodes.BADREQUEST.status).json(new iResponse(HTTPCodes.BADREQUEST, {}));
        }
        const check = user?.password === password;
        if (!check) {
            return res.status(HTTPCodes.BADREQUEST.status).json(new iResponse(HTTPCodes.BADREQUEST, {}));
        }
        const token = jwt.sign(
            { user_id: user._id, email: req.body.email, roleId: user.roleId },
            process.env.TOKEN_KEY
        );

        user.token = token;
        console.log(token, "toen");
        return res.status(200).json({
            success: true,
            redirect: true,
            data: user,
            token: token,
            url: "/admin/dashboard",
            msg: "Login Success",
        });



    } catch (ex) {
        logging.error(NAMESPACE, "LOGIN", "Request Login exception", ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const Logout = async (req, res) => {
    try {
        logging.info(NAMESPACE, "Logout", `Logout is called.`);
        if (req.session.loggedInUser) {
            req.session.destroy();
            res.redirect("/admin/login");
        } else res.redirect("/admin/login");
    } catch (ex) {
        logging.error(NAMESPACE, "Logout", `Logout is called exception`, ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const Register = async (req, res) => {
    try {
        logging.info(NAMESPACE, "register", "reister is called");
    } catch (ex) {
        logging.error(NAMESPACE, "register", "reister is called exception", ex);
    }
};

module.exports = { Login, Logout, Register };
