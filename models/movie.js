const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    movieName: {
      type: String,
      required: [true, "Please enter movie name"],
      lowercase: true,
      trim: true,
    },
    cast: [
      {
        name: {
          type: String,
          required: [true, "Actor Name should be required"],
          lowercase: true,
          minlength: [3, "Actor Name should be of Min 3 characters length"],
          trim: true,
        },
        profilePicture: {
          type: String,
        },
        role: {
          type: String,
          lowercase: true,
          trim: true,
        },
      },
    ],
    locations: {
      type: Array,
      required: [true, "Locations are required"],
    },
    languages: {
      type: Array,
      required: [true, "Languages are required"],
    },
    description: {
      type: String,
      trim: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movies", movieSchema);
