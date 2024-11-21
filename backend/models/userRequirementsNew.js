const mongoose = require('mongoose');

const UserRequirementSchema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotels' // This should match the model name for hotels
        },
        event: { type: String },
        isWedding: { type: Boolean },
        other: { type: String },
        community: { type: String },
        programs: { type: Array },
        eventType: { type: String },
        stDate: { type: String },
        enDate: { type: String },
        guest: { type: String },
        sitArrangement: { type: String },
        venue: { type: String },
        isAlaCarte: {
            type: Boolean,

        },
        compositionName: { type: String },
        isDrinks: {
            type: Boolean,
        },
        isCustomMenu: {
            type: Boolean,
        },
        isCustomDecor: {
            type: Boolean,
        },
        isCustomEntertainment: {
            type: Boolean,
        },
        isAssociateProgramFood: {
            type: Boolean,
            default: false
        },
        composition: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'NewFoodItem' // This should match the model name for questions
            }
        ],
        decorComposition: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'DecorItem' // This should match the model name for questions
            }
        ],
        entertainmentComposition: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'EntertainmentItem' // This should match the model name for questions
            }
        ],
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'bookingUser' },
    },
    {
        timestamps: true,
    }
);

const UserRequirementNew = mongoose.model('UserRequirementNew', UserRequirementSchema)
module.exports = UserRequirementNew;