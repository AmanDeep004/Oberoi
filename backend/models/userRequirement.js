const mongoose = require('mongoose');

const UserRequirementSchema = new mongoose.Schema(
    {
        hotelId: {
            type: String,
            required: true
        },
        eventType: {
            type: String,
            required: true
        },
        numberOfPersons: {
            type: String,
            required: true
        },
        clusterOrTheatre: {
            type: String,
            required: true
        },
        foodType: {
            type: String,
            required: true
        },
        alacarte: {
            type: Array,
            required: true
        },
        selectedPackage: {
            type: String,
            required: true

        },
        drinks: {
            type: Boolean,
            required: true

        },
        decor: {
            type: String,
            required: true

        },
        entertainment: {
            type: Object,
            required: true
        },
        userData: {
            type: Object,
            required: true
        },
    },
    { timestamps: true }
);

const UserRequirement = mongoose.model('UserRequirement', UserRequirementSchema)
module.exports = UserRequirement