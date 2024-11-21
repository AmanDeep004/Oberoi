class iResponse {
  constructor(HTTPCodes, data) {
    this.msg = HTTPCodes.msg;
    this.status = HTTPCodes.status;
    this.data = data;
  }
}



const HTTPCodes = Object.freeze({
  SUCCESS: {
    msg: "OK",
    status: 200,
  },
  CREATED: {
    msg: "Created",
    status: 201,
  },
  BADREQUEST: {
    msg: "Bad Request",
    status: 400,
  },
  UNAUTHORIZED: {
    msg: "UnAuthorized",
    status: 401
  },
  SESSIONTIMEOUT: {
    msg: "SessionTimeOut",
    status: 403
  },
  NOTFOUND: {
    msg: "Not found",
    status: 404,
  },
    METHODNOTALLOWED: {
    msg: "Method Not Allowed",
    status: 405,
  },
  AlreadyExist: {
    msg: "AlreadyExist",
    status: 409
  },
  PAYlOADTOOLARGE: {
    msg: "PayloadTooLarge",
    status: 413
  },
  ERROR: {
    msg: "Internal Server Error",
    status: 500,
  },
  ServiceUnavailable: {
    msg: "Service Unavailable",
    status: 503
  }

});

module.exports = { HTTPCodes, iResponse };
