const mongoose = require("mongoose");

const decorCategorySchema = new mongoose.Schema(
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

const DecorCategory = mongoose.model("DecorCategory", decorCategorySchema);

module.exports = DecorCategory;
