const mongoose = require('mongoose');

const foodPackageSchema = new mongoose.Schema(
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
        hotelId: {
            type: String,
            required: true,
        },

        foodItems: {
            type: Array,
            required: true,
        },
        image:{
            type: String,
            required:true
        }

    }
    ,
    {
        timestamps: true
    }
)

const FoodPackage = mongoose.model('FoodPackage', foodPackageSchema);

module.exports = FoodPackage;