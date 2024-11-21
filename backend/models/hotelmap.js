const mongoose = require("mongoose");

HotelMapSchema = new mongoose.Schema(
    {
        hotelName: {
            type: String,
            required: true
        },

        hotelId: {
            type: String,
            required: true
        },
    }
)

const HotelName = mongoose.model('HotelNames', HotelMapSchema);
module.exports = HotelName;