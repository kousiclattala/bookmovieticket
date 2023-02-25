const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema(
  {
    theaterName: {
      type: String,
      required: [true, "Theater Name is required"],
      minLength: [3, "Theter name should be of minimum 3 characters length"],
    },
    theaterLocation: {
      type: String,
      required: [true, "Theater location is required"],
      minLength: [
        3,
        "Theater Location should be of minimum 3 characters length",
      ],
      lowercase: true,
    },
    noOfScreens: {
      type: Number,
      required: [true, "No of screens is required"],
      default: 1,
    },
    moviesStreaming: [
      {
        movieDetails: {
          type: mongoose.Schema.ObjectId,
          ref: "Movies",
          required: true,
        },
        noOfDaysStreaming: {
          type: Number,
          required: true,
          default: 1,
        },
        streamingDates: {
          type: Array,
          required: true,
        },
        streamingTimings: {
          type: Array,
          required: true,
        },
        showBookingDatesTimings: {
          type: Object,
          default: {
            "2023-02-25": {
              "09:00": ["A1"],
            },
          },
        },
      },
    ],
    theaterLayout: {
      type: Array,
      default: [
        {
          rowName: "A",
          price: "299",
          seats: [],
        },
      ],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          default: 0,
        },
        comment: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Theater", theaterSchema);
