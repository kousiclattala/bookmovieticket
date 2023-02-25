const mongoose = require("mongoose");
const { validateEmail } = require("../utils/helper");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name should be of min 3 characters"],
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, "Please enter a valid emailId"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minLength: [6, "Password must be of minimum 6 characters long"],
      select: false,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number must be required"],
      minLength: [10, "Mobile number should be of length 10"],
      maxLength: [10, "Mobile number should be of length 10"],
      unique: true,
    },
    otp: {
      type: String,
      default: 0,
    },
    role: {
      type: String,
      required: [true, "User role should be required"],
      enum: {
        values: ["superadmin", "vendoradmin", "user"],
        message: "{VALUE} is not supported",
      },
      lowercase: true,
      default: "user",
    },
    bookings: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Bookings",
      },
    ],
    reviews: [
      {
        movieDetails: {
          type: mongoose.Schema.ObjectId,
          ref: "Movies",
        },
        rating: {
          type: Number,
        },
        comments: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
