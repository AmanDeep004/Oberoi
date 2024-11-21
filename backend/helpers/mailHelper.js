const nodemailer = require('nodemailer');

const sendEmail = (to, body) => {
    var mailOptions = {
        from: 'noreply@kestonevirtualevents.in',
        to: to,
        subject: 'Kestone Metaverse',
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const transporter = nodemailer.createTransport({
    service: 'gmail',//'smtp.gmail.com',  //in place of service use host...
    secure: true,//true
    port: 465,
    auth: {
        user: 'support@vosmos.live',//'metaverse.kestoneglobal@gmail.com',
        pass: 'Met@supp@rt2022'//'Kestone.Metaverse@123'
    }
});

transporter.sendEMail = function (mailRequest) {
    return new Promise(function (resolve, reject) {
        transporter.sendMail(mailRequest, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve("The message was sent!");
            }
        });
    });
}

module.exports = transporter;


