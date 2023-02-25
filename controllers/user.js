const { response } = require("../utils/response");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const {
  generateHashedPassword,
  generateRandomNumber,
  generateAuthToken,
} = require("../utils/helper");
const Bookings = require("../models/bookings");

exports.signup = async (req, res) => {
  try {
    const { email, password, name, phoneNumber } = req.body;

    const user = await User.findOne({ email: email });

    if (user == null) {
      const passwordHash = generateHashedPassword(password);

      const userObj = {
        email,
        password: passwordHash,
        name,
        mobileNumber: phoneNumber,
      };

      const user = await User.create(userObj);

      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: "2 days",
      });

      user.password = undefined;

      const data = {
        user,
        token,
      };

      res
        .status(200)
        .json(response(true, 200, "User signed up successfully", data));
    } else {
      res.status(400).json(response(false, 400, "User already exists"));
    }
  } catch (error) {
    res
      .status(400)
      .json(response(false, 400, "Error in singing up user", error));
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).select("+password");

    if (user != null) {
      const isValidPassword = await bcrypt.compare(password, user.password);

      logger.info(isValidPassword);

      if (!isValidPassword) {
        res.status(400).json(response(false, 400, "Invalid password"));
      }

      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: "2 days",
      });

      user.password = undefined;

      var data = {
        user,
        token,
      };

      res
        .status(200)
        .json(response(true, 200, "User signed in successfully", data));
    } else {
      res.status(400).json(response(false, 400, "User doesn't exists"));
    }
  } catch (error) {
    res.status(400).json(response(false, 400, "Error in singing user", error));
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { emailId } = req.body;

    if (emailId == null || emailId == undefined) {
      return res.status(404).json(response(false, 404, "Mail id is missing"));
    }

    const user = await User.findOne({ email: emailId });

    if (user == null) {
      return res
        .status(404)
        .json(
          response(
            false,
            404,
            `No user found with this mail adress: ${emailId}, please enter valid mail address`
          )
        );
    }

    res
      .status(200)
      .json(
        response(
          true,
          200,
          `A password reset link is sent to the above mentioned mailid: ${emailId}, please use that link to reset your password`
        )
      );
  } catch (error) {
    logger.error(error);
    res
      .status(400)
      .json(response(false, 400, "Error in resetting password", error));
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, emailId } = req.body;

    if (emailId == null && password == null) {
      return res
        .status(404)
        .json(response(false, 404, "emailid or pasword is missing"));
    }

    const user = await User.findOne({ email: emailId }).select("+password");

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
      return res
        .status(401)
        .json(response(false, 401, "old and new password are same"));
    }

    const passwordHash = generateHashedPassword(password);

    const updatedUser = await User.findByIdAndUpdate(
      { _id: user._id },
      {
        password: passwordHash,
      }
    );

    updatedUser.password = undefined;

    res
      .status(200)
      .json(response(true, 200, "password updated successfully", updatedUser));
  } catch (error) {
    logger.error(error);
    res
      .status(400)
      .json(response(false, 400, "Error in resetting password", error));
  }
};

exports.requestOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (mobileNumber == null) {
      return res
        .status(404)
        .json(response(false, 404, "Mobilenumber is missing"));
    }

    const user = await User.findOne({ mobileNumber });

    if (user == null) {
      return res
        .status(404)
        .json(response(false, 404, "Mobile number doesn't exist"));
    }

    const otp = generateRandomNumber();

    await User.findByIdAndUpdate(
      { _id: user._id },
      {
        otp,
      },
      { new: true }
    );

    res
      .status(200)
      .json(response(true, 200, "Otp sent successful", { otp, mobileNumber }));
  } catch (error) {
    res.status(400).json(response(false, 400, "Error in getting OTP", error));
  }
};

exports.validateOtp = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (mobileNumber == null) {
      return res
        .status(404)
        .json(response(false, 404, "Mobilenumber is missing"));
    }

    const user = await User.findOne({ mobileNumber });

    if (user == null) {
      return res
        .status(404)
        .json(response(false, 404, "Mobile number doesn't exist"));
    }

    if (user.otp !== otp) {
      return res.status(400).json(response(false, 400, "Invalid otp"));
    }

    await User.findByIdAndUpdate(
      { _id: user._id },
      {
        otp: "0",
      },
      { new: true }
    );

    const token = generateAuthToken(user._id);

    const data = {
      user,
      token,
    };

    res
      .status(200)
      .json(response(true, 200, "Otp verified successfully", data));
  } catch (error) {
    logger.error(error);
    res.status(400).json(response(false, 400, "Error in verifying OTP", error));
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = req.user;

    const { name, email, mobileNumber } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      { _id: user._id },
      {
        name,
        email,
        mobileNumber,
      },
      {
        new: true,
      }
    );

    updatedUser.password = undefined;

    res
      .status(200)
      .json(response(true, 200, "Updated user successfully", updatedUser));
  } catch (error) {
    logger.error(error);
    res.status(400).json(response(false, 400, "Error in updating user", error));
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if ((userId && role) == null) {
      return res
        .status(404)
        .json(response(false, 404, "UserId or role is missing"));
    }

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        role,
      },
      {
        new: true,
      }
    );

    user.password = undefined;

    res
      .status(200)
      .json(response(true, 200, "User role changed successfully", user));
  } catch (error) {
    res
      .status(400)
      .json(response(false, 400, "Error in changing user role", error));
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = req.user;

    res
      .status(200)
      .json(response(true, 200, "User details fetched successfully", user));
  } catch (error) {
    res
      .status(400)
      .json(response(false, 400, "Error in getting user details", error));
  }
};

exports.getSingleUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user == null) {
      return res.status(404).json(response(false, 404, "No user found"));
    }

    res.status(200).json(response(true, 200, "User details fetched", user));
  } catch (error) {
    res
      .status(400)
      .json(response(false, 400, "Error in getting user details", error));
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const user = req.user;

    res
      .status(200)
      .json(response(true, 200, "Fetched all bookings", user.bookings));
  } catch (error) {
    res
      .status(400)
      .json(response(false, 400, "Error in getting all bookings", error));
  }
};

exports.getSingleBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (bookingId == null) {
      return res
        .status(404)
        .json(response(false, 404, "Booking Id is missing"));
    }

    const booking = await Bookings.findById(bookingId);

    if (booking == null) {
      return res.status(404).json(response(false, 404, "No booking is found"));
    }

    res.status(200).json(response(true, 200, "Booking fetched", booking));
  } catch (error) {
    res
      .status(400)
      .json(response(false, 400, "Error in getting single bookings", error));
  }
};
