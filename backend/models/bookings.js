const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        noOfPax: {
            type: String,
            required: true
        },
        dateRange: {
            type: String
        },
        eventType: {
            type: String
        },
        phone: {
            type: String
        },
        hallName: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Bookings = mongoose.model('Bookings', BookingSchema);

module.exports = Bookings;