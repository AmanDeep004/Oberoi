const mongoose = require('mongoose');

const ContactInfoSchema = new mongoose.Schema({
    email: {
        type: String
    },
    contactNo: {
        type: String
    }
});

const ContactSchema = new mongoose.Schema({
    restaurant: {
        type: ContactInfoSchema
    },
    room: {
        type: ContactInfoSchema
    },
    banquet: {
        type: ContactInfoSchema
    }
})

const callbackSchema = new mongoose.Schema({
    banquet: {
        type: String,
        default: ""

    },
    stay: {
        type: String,
        default: ""
    },
    explore: {
        type: String,
        default: ""
    }
});

const HotelSchema = new mongoose.Schema(
    {
        hotelName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        contactInfo: {
            type: ContactSchema,
            required: true
        },
        reservationEmail: {
            type: String
        },
        banquetEmail: {
            type: String
        },
        contactNo: {
            type: String
        },
        reservationNo: {
            type: String
        },
        imageUrl: {
            type: String
        },
        planMyEvent: {
            type: Boolean
        },
        roomInfo: {
            type: Array
        },
        // foodItems: {
        //     type: Array
        // },
        // foodPackage: {
        //     type: Array
        // },
        // decor: {
        //     type: Array
        // },

        src: {
            type: String
        },
        urlName: {
            type: String,
            // unique: true
        },
        callback: {
            type: callbackSchema,

        },
        friendlyName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        }
    },
    {
        timestamps: true
    }
);

const Hotels = mongoose.model('Hotels', HotelSchema);

module.exports = Hotels;