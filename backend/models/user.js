const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        roleId: {
            type: Number,
            required: true
        },
        avatar: {
            type: String,
            default: 'https://cdn.yz.events/dummy.png'
        },
        hotelId: {
            type: String,
            //required: true
        },
        token: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('Users', UserSchema);

module.exports = User;