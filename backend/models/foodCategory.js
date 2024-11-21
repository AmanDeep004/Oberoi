const mongoose = require("mongoose");

const foodCategorySchema = new mongoose.Schema(
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

const FoodCategory = mongoose.model("FoodCategory", foodCategorySchema);

module.exports = FoodCategory;
