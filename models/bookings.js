const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    movieDetails: {
      type: mongoose.Schema.ObjectId,
      ref: "Movies",
      required: true,
    },
    ticket: {
      theater: {
        type: mongoose.Schema.ObjectId,
        ref: "Theater",
        required: true,
      },
      timing: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      seats: {
        type: Array,
        required: true,
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: String,
      required: true,
      default: "0",
    },
    subtotal: {
      type: String,
      required: true,
      default: "0",
    },
    totaltax: {
      type: String,
      required: true,
      default: "0",
    },
    discountAmount: {
      type: String,
      required: true,
      default: "0",
    },
    paymentStatus: {
      type: String,
      default: "null",
    },
    bookingStatus: {
      type: String,
      default: "null",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bookings", bookingSchema);
