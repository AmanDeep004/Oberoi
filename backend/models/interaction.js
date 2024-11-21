const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        hotel: { type: mongoose.Types.ObjectId, ref: 'Hotels'},
        action: { type: String },
        value: { type: mongoose.Schema.Types.Mixed }
    },
    {
        timestamps: true
    }
)

const Interaction = mongoose.model("interaction", InteractionSchema);

module.exports = Interaction;

