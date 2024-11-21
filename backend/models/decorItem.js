const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  link: {
    type: String,
  },
});

const decorItemSchema = new mongoose.Schema(
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
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "DecorCategory",
    },
    tagName: {
      type: String,
    },
    image: {
      type: String,
    },
    images: {
      type: Array,
    },
    videos: [videoSchema],
  },
  {
    timestamps: true,
  }
);

const DecorItem = mongoose.model("DecorItem", decorItemSchema);

module.exports = DecorItem;
