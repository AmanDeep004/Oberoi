const mongoose = require('mongoose');

const foodItemsSchema = new mongoose.Schema(
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
        category: {
            type: String,
            required: true,
        },
        veg: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const FoodItems = mongoose.model('FoodItems', foodItemsSchema);

module.exports = FoodItems;