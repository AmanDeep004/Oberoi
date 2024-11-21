const mongoose = require('mongoose');

const decorSchema = new mongoose.Schema(
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
        hotelId: {
            type: String,
            required: true,
        },

        imageUrl: {
            type: Array,
            // required: true,
        }

    }
    ,
    {
        timestamps: true
    }
)

const Decor = mongoose.model('Decor', decorSchema);

module.exports = Decor;