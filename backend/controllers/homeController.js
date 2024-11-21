const { uploadFile } = require('../helpers/awsHelper');
var formidable = require('formidable');
const logging = require('../helpers/logging');
const Hotels = require('../models/hotel');
const Bookings = require('../models/bookings');
const MailerService = require('../helpers/mailHelper');
const { HTTPCodes, iResponse } = require("../helpers/Common");
const AWSBucket = process.env.AWS_BUCKETNAME;

const NAMESPACE = 'HOME Controller';


// var rs = new iResponse(HTTPCodes.BADREQUEST, {});
// rs.msg = ex.message;
// return res.status(HTTPCodes.BADREQUEST).json(rs);

//return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, JSON.parse(JSON.stringify(response.data))));

//** Route Handlers aka actionMethods */

const Home = async (req, res) => {
    logging.info(NAMESPACE, 'Home', 'Inside home');
    res.render('index', { layout: false });
};

const GetData = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'GetData', 'Getting hotel data', req.params);
        let data = await Hotels.findById(req.params.hotelId).exec();
        return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, data));
    }
    catch (ex) {
        logging.error(NAMESPACE, 'GetData', 'Getting hotel data exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const UploadImage = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'UploadImage', 'Uploading Image');
        var form = new formidable.IncomingForm({
            //uploadDir: __dirname + '/tmp',  // don't forget the __dirname here
            keepExtensions: true
        });
        form.parse(req, async (err, fields, files) => {
            var uploadedUrl = await uploadFile(`${AWSBucket}/RoyalOrchid`, files.file[0].filepath, files.file[0].originalFilename);
            if (uploadedUrl) {
                return res.status(HTTPCodes.SUCCESS.status).json(new iResponse(HTTPCodes.SUCCESS, uploadedUrl));
            } else {
                var rs = new iResponse(HTTPCodes.BADREQUEST, {});
                rs.msg = uploadedUrl;
                return res.status(HTTPCodes.BADREQUEST.status).json(rs);
            }
        });
    }
    catch (ex) {
        logging.error(NAMESPACE, 'UploadImage', 'Uploading Image exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }
};

const UploadVideo = async (req, res) => {

};

const BookAVenue = async (req, res) => {
    try {
        logging.info(NAMESPACE, 'BookAVenue', 'Booking Venue', req.body);
        let booking = new Bookings(req.body);
        await booking
            .save()
            .then((result) => {
                let htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Document</title>
            </head>
            <body style="background: #eee">
                <table style="width: 100%;max-width: 600px;border-radius: 8px;background: #fff;overflow: hidden; font-size: 12px; font-family: Helvetica, Arial, 'sans-serif'" width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF" align="center">
                          <tbody><tr>
                            <td style="padding: 15px" bgcolor="#fff" align="left"><img src="https://events.kestoneapps.in/emailers/logo.png" alt="" width="120" height="25" style="vertical-align: middle"></td>
                          </tr>
                          <tr>
                            <td style="text-align: left;padding: 0px 16px;" align="left">
                                <p style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:22px;color:#333333;font-size:14px;margin-bottom: 8px;font-weight: 600"><br>
                                <span class="grTextFirst">Hi</span> <span class="grTextSec">,</span></p>
                              <p id="firstCopy" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:22px;color:#333333;font-size:14px;margin-bottom: 0px">
                              You have a new enquiry from through the Virtual Tour platform.</p>
                                
                                
                                 <p id="secCopy" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:22px;color:#333333;font-size:14px;margin-bottom: 0px">Here are the details we have captured:</p>
                                 <p id="secCopy" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:22px;color:#333333;font-size:14px;margin-bottom: 0px"><strong>Name: </strong> ${req.body.name}</p>
                                 <p id="secCopy" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:22px;color:#333333;font-size:14px;margin-bottom: 0px"><strong>Email: </strong> ${req.body.email}</p>
                                 <p id="secCopy" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:22px;color:#333333;font-size:14px;margin-bottom: 0px"><strong>NoOfPax: </strong> ${req.body.noOfPax}</p>
                                 <p id="secCopy" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:22px;color:#333333;font-size:14px;margin-bottom: 0px"><strong>DateRange: </strong> ${req.body.dateRange}</p>
                                 <p id="secCopy" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:22px;color:#333333;font-size:14px;margin-bottom: 0px"><strong>EventType: </strong> ${req.body.eventType}</p>
                                 <p id="secCopy" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:22px;color:#333333;font-size:14px;margin-bottom: 0px"><strong>Phone: </strong> ${req.body.phone}</p>
                                 <p id="secCopy" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:22px;color:#333333;font-size:14px;margin-bottom: 0px"><strong>HallName: </strong> ${req.body.hallName}</p>
                              </td>
                          </tr>
                          <tr>
                            <td style="padding: 0px 16px;">
                                <br>
                              <p style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:22px;color:#333333;font-size:14px;margin-bottom: 0px;margin-top: 0px;" id="signCopy"><strong>Regards,</strong><br>VOSMOS<br>
                                
                                </p></td>
                          </tr>
                          <tr>
                            <td>&nbsp;</td>
                          </tr>
                          <tr>
                            <td>&nbsp;</td>
                          </tr>
                          <tr>
                            <td style="line-height: 20px; background: #000; text-align: center; font-size: 10px" bgcolor="e82a2a"><div class="fs10 text-center text-white" style="color: #fff">Copyright © 2020. All rights reserved. <a href="https://kestoneglobal.com/privacy-policy/" target="_blank" style="text-decoration: none;color: #19aaa4">Privacy Policy</a></div></td>
                          </tr>
                        </tbody></table>
            </body>
            </html>
                    
                    `;
                let mailOptions = {
                    from: 'support@vosmos.live',
                    to: 'reservations@royalorchidhotels.com',
                    subject: `YOU HAVE NEW ENQUIRY`,
                    text: '',
                    html: htmlContent
                };

                MailerService
                    .sendMail(mailOptions)
                    .then(function (email) {
                        logging.info(NAMESPACE, 'BookAVenue', 'Mail sent');
                    })
                    .catch(function (exception) {
                        logging.error(NAMESPACE, 'BookAVenue', 'Mailer service exception', exception);
                    });

                var rs = new iResponse(HTTPCodes.SUCCESS, {});
                rs.msg = 'Thank you for your interest. Our representative will connect with you shortly!';
                return res.status(HTTPCodes.SUCCESS.status).json(rs);
            })
            .catch((error) => {
                logging.error(NAMESPACE, 'BookAVenue', 'DB exception', error);
                var rs = new iResponse(HTTPCodes.BADREQUEST, {});
                rs.msg = error._message;
                return res.status(HTTPCodes.BADREQUEST.status).json(rs);

            });
    }
    catch (ex) {
        logging.error(NAMESPACE, 'BookAVenue', 'Booking Venue main exception', ex);
        var rs = new iResponse(HTTPCodes.BADREQUEST, {});
        rs.msg = ex.message;
        return res.status(HTTPCodes.BADREQUEST.status).json(rs);
    }

};

module.exports = { Home, GetData, UploadImage, BookAVenue };
