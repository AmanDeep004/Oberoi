const mongoose = require('mongoose');

const EntertainmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },


        hotelId: {
            type: String,
            required: true,
        },

        imageUrl: {
            type: Array,
            // required: true,
        },



    }
    ,
    {
        timestamps: true
    }
)
const Entertainment = mongoose.model("EntertainmentSchema", EntertainmentSchema)
module.exports = Entertainment;