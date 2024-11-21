const logging = require("../helpers/logging");
const NAMESPACE = "OTPController";
const { HTTPCodes, iResponse } = require("../helpers/Common");
const bookingUser = require("../models/bookingUser");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { EnumUserRoles } = require("../helpers/constants");
function getOTP() {
  // Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString(); // Convert to string before returning
}

const createUser = async (data) => {
  try {
    const otp = getOTP();
    // console.log(otp, "otp");
    const user = {
      name: data.name,
      email: data.email,
      phone: data.mobile,
      OTP: otp,
      hotelId: data.hotelId,
      roleId: EnumUserRoles.User,
      utmFields: data.utmFields
    };
    const result = await bookingUser.create(user);
    //console.log(result, "result");
    if (result) {
      return {
        otp: otp,
        id: result._id,
      };
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const generateOTP = async (req, res) => {
  try {
    logging.info(NAMESPACE, "GenerateOTP", "genereting otp");
    const { name, email, mobile, hotelId } = req.body;
    if (!email || !name || !mobile || !hotelId) {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "Fill all the required fields";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
    var data = await createUser(req.body);

    if (data) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url:
          "https://api.authkey.io/request?authkey=" +
          process.env.AUTH_IO_TOKEN +
          "&mobile=" +
          mobile +
          "&country_code=" +
          "+91" +
          "&sid=9827&company=kestoneglobal&otp=" +
          data.otp,
        headers: {},
      };
      await axios
        .request(config)
        .then(async (response) => {
          var rs = new iResponse(HTTPCodes.SUCCESS, {
            id: data.id,
          });
          rs.msg = "success";
          return res.status(HTTPCodes.SUCCESS.status).json(rs);
        })
        .catch(async (error) => {
          logging.error(NAMESPACE, "GenerateOtp", "axios exception", error);
          var rs = new iResponse(HTTPCodes.BADREQUEST, {});
          rs.msg = "error";
          return res.status(HTTPCodes.BADREQUEST.status).json(rs);
        });
    } else {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "Something went wrong";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
  } catch (error) {
    logging.error(NAMESPACE, "GenerateOtp", "GenerateOtp exception", error);
  }
};

const verifyOTP = async (req, res) => {
  try {
    logging.info(NAMESPACE, "VerifyOtp", "VerifyOtp function", req.body);
    const { otp, id } = req.body;
    if (!otp || !id) {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "Fill all the required fields";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
    //we have to verify otp here
    const user = await bookingUser.findById(id).exec();
    // console.log(user, "user");
    // console.log(otp == 290484, "otp")

    let otpVer = process.env.OTP;
    if (otp == otpVer || user.OTP == otp.toString()) {
      user.verified = true;
      await user.save();
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: user.email,
            name: user.name,
            id: user._id,
            mobile: user.phone,
          },
        },
        process.env.SECRET_TOKEN
        // "secretToken"
      );
      var rs = new iResponse(HTTPCodes.SUCCESS, {
        verifiied: true,
        accessToken: accessToken,
      });
      rs.msg = "success";
      return res.status(HTTPCodes.SUCCESS.status).json(rs);
    }


    else {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "Incorrect OTP";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }



    //
  } catch (error) {
    logging.error(NAMESPACE, "VerifyOtp", "VerifyOtp exception", ex);
  }
};

const getUserData = async (req, res) => {
  try {
    console.log(req.UserInfo);
    if (!req.UserInfo) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Token is not valid";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    var rs = new iResponse(HTTPCodes.SUCCESS, { UserInfo: req.UserInfo });
    rs.msg = "Item sent Successfully";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  } catch (ex) {
    logging.error(NAMESPACE, "getUserData", "getUserData exception", ex);
    var rs = new iResponse(HTTPCodes.BADREQUEST, {});
    rs.msg = ex.message;
    return res.status(HTTPCodes.BADREQUEST.status).json(rs);
  }
};

const generateGuestUser = async (req, res) => {
  try {
    logging.info(NAMESPACE, "GenerateGuestUser", "GenerateGuestUser", req.body);
    const { hotelId, utmFields } = req.body;
    if (!hotelId) {
      var rs = new iResponse(HTTPCodes.BADREQUEST, {});
      rs.msg = "HotelId is required";
      return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }

    const user = {
      name: "guestUser",
      email: "guestUser@vosmsos.com",
      phone: 9999999999,
      // OTP: otp,
      hotelId: hotelId,
      roleId: EnumUserRoles.User,
      utmFields: utmFields
    };
    const result = await bookingUser.create(user);



    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: user.email,
          name: user.name,
          id: user._id,
          mobile: user.phone,
        },
      },
      process.env.SECRET_TOKEN
      // "secretToken"
    );
    var rs = new iResponse(HTTPCodes.SUCCESS, {
      verifiied: true,
      accessToken: accessToken,
    });
    rs.msg = "success";
    return res.status(HTTPCodes.SUCCESS.status).json(rs);
  }
  catch (error) {
    logging.error(NAMESPACE, "Generate GuestUser", "Generate GuestUser exception", ex);
  }
};
module.exports = {
  generateOTP,
  verifyOTP,
  generateGuestUser,
  getUserData,
};
