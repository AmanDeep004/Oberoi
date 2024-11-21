const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Hotels",
    },
    //starter/drink/maincourse/desert/
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "NewFoodCategory",
    },
    image: {
      type: String,
      //required: true,
    },
    isVeg:{
      type:Boolean
    }
  },
  {
    timestamps: true,
  }
);

const FoodItem = mongoose.model("NewFoodItem", foodItemSchema);

module.exports = FoodItem;
