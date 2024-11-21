const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // hotelId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "Hotels",
    // },
  },
  {
    timestamps: true,
  }
);

const WeddingCommunity = mongoose.model("WeddingCommunity", CategorySchema);

module.exports = WeddingCommunity;