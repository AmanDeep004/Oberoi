const jwt = require("jsonwebtoken");
const { HTTPCodes, iResponse } = require("../helpers/Common");
const logging = require("../helpers/logging");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.token;
  console.log(authHeader,"authHeader")
  if (!authHeader?.startsWith("Bearer ")) {
    var rs = new iResponse(HTTPCodes.NOTFOUND, {});
    rs.msg = "Unauthorized";
    return res.status(HTTPCodes.NOTFOUND.status).json(rs);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, "secretToken", (err, decoded) => {
    if (err) {
      var rs = new iResponse(HTTPCodes.NOTFOUND, {});
      rs.msg = "Token is not valid";
      return res.status(HTTPCodes.NOTFOUND.status).json(rs);
    }
    console.log(decoded, "dta");
    req.UserInfo = decoded.UserInfo;
    next();
  });
};

module.exports = verifyJWT;
