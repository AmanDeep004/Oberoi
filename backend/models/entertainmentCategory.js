const mongoose = require("mongoose");

const entertainmentCategorySchema = new mongoose.Schema(
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

const EntertainmentCategory = mongoose.model("EntertainmentCategory", entertainmentCategorySchema);

module.exports = EntertainmentCategory;
