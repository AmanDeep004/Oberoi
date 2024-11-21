const nodemailer = require('nodemailer');



const sendMail = async (mailOptions, hotelId) => {

    const getAuthCredentials = (hotelId) => {
        if (hotelId) {
            switch (hotelId) {
                case '65c1b7fe42cf7212d6e107e7': // Pune
                    mailOptions.from = `"Royal Orchid" <${process.env.SMTP_USER_PUNE}>`;
                    console.log('Pune credentials used');
                    return {
                        user: process.env.SMTP_USER_PUNE,
                        pass: process.env.SMTP_PASS_PUNE,
                    };
                // case '66a9223e7e09fb7b0a719bd8': // Yelahanka
                //     console.log('Yelahanka credentials used');
                //     return {
                //         user: 'hotelB@example.com',
                //         pass: 'passwordB',
                //     };

                // case '6697f85809b350f2120ba9ef': // Goa
                //     console.log('Goa credentials used');
                //     return {
                //         user: 'hotelC@example.com',
                //         pass: 'passwordC',
                //     };

                // Bangalore (Default case)
                default:
                    console.log('Default credentials used (Bangalore or others)');
                    mailOptions.from = `"Royal Orchid" <${process.env.SMTP_USER_BANGALORE}>`;
                    return {
                        user: process.env.SMTP_USER_BANGALORE,
                        pass: process.env.SMTP_PASS_BANGALORE,
                    };
            }

        }
    };

    const authCredentials = getAuthCredentials(hotelId);
    console.log(authCredentials, "authCredentials")
    let transporter = nodemailer.createTransport({
        host: 'smtppro.zoho.in',
        port: 465,
        secure: true,
        // auth: {
        //     user: process.env.SMTP_USER,
        //     pass: process.env.SMTP_PASS,
        //     // user: process.env.SMTP_USER_PUNE,
        //     // pass: process.env.SMTP_PASS_PUNE,
        // },
        auth: authCredentials,
    });

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return true; // Email sent successfully
    } catch (error) {
        console.error('Error sending email:', error);
        return false; // Email failed to send
    }
};

// const sendMail = async (mailOptions, hotelId) => {
//     console.log(hotelId, "hotelId_sendMail")
//     console.log(process.env.SMTP_USER_BANGALORE, process.env.SMTP_PASS_BANGALORE, "env__")
//     console.log(process.env.SMTP_USER_PUNE == process.env.SMTP_USER, "what")
//     const getAuthCredentials = (hotelId) => {
//         switch (hotelId) {
//             case '65c1b7fe42cf7212d6e107e7':    //pune
//                 return {
//                     user: process.env.SMTP_USER_PUNE,
//                     pass: process.env.SMTP_PASS_PUNE,
//                 };
//             case '66a9223e7e09fb7b0a719bd8':   //yelahanka
//                 return {
//                     user: 'hotelB@example.com',
//                     pass: 'passwordB',
//                 };
//             // case '6697f85809b350f2120ba9ef':    //goa
//             //     return {
//             //         user: 'hotelC@example.com',
//             //         pass: 'passwordC',
//             //     };

//             // bangalore  635913e4687c5bf65c4c1dbf
//             default:
//                 return {
//                     user: process.env.SMTP_USER_BANGALORE,
//                     pass: process.env.SMTP_PASS_BANGALORE,
//                 };
//         }
//     };

//     const authCredentials = getAuthCredentials(hotelId);
//     console.log(authCredentials, "authCredentials")
//     let transporter = nodemailer.createTransport({
//         host: 'smtppro.zoho.in',
//         port: 465,
//         secure: true,
//         // auth: {
//         //     user: process.env.SMTP_USER,
//         //     pass: process.env.SMTP_PASS,
//         //     // user: process.env.SMTP_USER_PUNE,
//         //     // pass: process.env.SMTP_PASS_PUNE,
//         // },
//         auth: authCredentials,
//     });

//     try {
//         let info = await transporter.sendMail(mailOptions);
//         console.log('Message sent: %s', info.messageId);
//         return true; // Email sent successfully
//     } catch (error) {
//         console.error('Error sending email:', error);
//         return false; // Email failed to send
//     }
// };


module.exports = sendMail; 
