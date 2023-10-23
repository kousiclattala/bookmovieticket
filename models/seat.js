const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    seatNo: {
      type: String,
      required: [true, "Seat number should be given"],
      trim: true,
    },
    bookedDatesAndTimes: {
      type: Object,
    },
    theaterId: {
      type: mongoose.Schema.ObjectId,
      ref: "Theater",
      required: [true, "Theater id is required"],
    },
    movieId: {
      type: mongoose.Schema.ObjectId,
      ref: "Movies",
    },
    price: {
      type: String,
      required: [true, "Seat price is required"],
      default: "0",
    },
    class: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Seat", seatSchema);
