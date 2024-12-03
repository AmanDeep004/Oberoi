const mongoose = require("mongoose");

const meetingRequestSchema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel", // Assuming there's a "Hotel" collection
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BookingUser", // Assuming there's a "User" collection
            required: true,
        },
        startDateTime: {
            type: Date,
            required: true,
        },
        endDateTime: {
            type: Date,
            required: true,
        },
        purpose: {
            type: String,
            required: true,
            minlength: 5, // At least 5 characters long
        },
    },
    { timestamps: true }
);

// Create the model from the schema
const MeetingRequest = mongoose.model("MeetingRequest", meetingRequestSchema);

module.exports = MeetingRequest;
