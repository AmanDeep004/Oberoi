const Interaction = require("../models/interaction");
const logging = require("../helpers/logging");
const NAMESPACE = "Interaction"
const { HTTPCodes, iResponse } = require("../helpers/Common");

const saveInteraction = async (req, res) => {
    try {
        logging.info(NAMESPACE, "Save Interaction", "Save Interaction called");
        const { action,value,hotelId } = req.body;
        const  { id } = req.UserInfo;
        console.log(req.UserInfo,"user info")
        if (!id || !action) {
            var rs = new iResponse(HTTPCodes.ERROR, {});
            rs.msg = "user and action is required";
            return res.status(HTTPCodes.ERROR.status).json(rs);
        }
        var data = new Interaction({
            user:id,
            action:action,
            value:value,
            hotel:hotelId
        });
        await data.save();
        var rs = new iResponse(HTTPCodes.SUCCESS, {data});
        rs.msg = "Interaction saved";
        return res.status(HTTPCodes.SUCCESS.status).json(rs);
    } catch (ex) {
        console.log('Ex in saving interaction: ', ex);
        logging.error(
            NAMESPACE,
            "Save Interaction",
            "Save Interaction exception",
            ex
        );
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
}

module.exports = {
    saveInteraction
}