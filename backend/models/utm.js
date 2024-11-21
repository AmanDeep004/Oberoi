const mongoose = require('mongoose');

const UtmSchema = new mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
        },
        hotelName: {
            type: String,
            required: true,
        },
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
        },
        isActive: {
            type: Boolean,
            required: true
        },
        utm: {
            type: Object,
            required: true
        },
        generatedUrl: {
            type: String,
            // required: true,
        },

    }

    ,
    {
        timestamps: true,
    }
);

const Campaign = mongoose.model('Campaign', UtmSchema)
module.exports = Campaign;