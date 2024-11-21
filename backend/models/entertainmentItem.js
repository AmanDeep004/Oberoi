const mongoose = require("mongoose");


const videoSchema = new mongoose.Schema({
  type: {
    type: String
  },
  url: {
    type: String,
  },
});


const entertainmentItemSchema = new mongoose.Schema(
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
      ref: "EntertainmentCategory",
    },
    image: {
      type: String,
      //required: true,
    },
    images: {
      type: Array,
    },
    videos: [videoSchema],
    duration: {
      type: String,
    },
    lang: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const EntertainmentItem = mongoose.model(
  "EntertainmentItem",
  entertainmentItemSchema
);

module.exports = EntertainmentItem;
