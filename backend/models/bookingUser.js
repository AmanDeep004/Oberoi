const mongoose = require("mongoose");
const BookingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    OTP: {
      type: String,
      required: true,
    },
    hotelId: {
      // type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotels",
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    roleId: {
      type: Number
    },
    utmFields: {
      type: Object
    }
  },
  {
    timestamps: true,
  }
);

const BookingUser = mongoose.model("BookingUsers", BookingUserSchema);

module.exports = BookingUser;
