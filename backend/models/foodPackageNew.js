const mongoose = require("mongoose");

const foodCategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodCategory",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const foodPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Hotels",
    },
    foodCategories: [foodCategorySchema],
  },
  {
    timestamps: true,
  }
);

const NewFoodPackage = mongoose.model("NewFoodPackage", foodPackageSchema);

module.exports = NewFoodPackage;
