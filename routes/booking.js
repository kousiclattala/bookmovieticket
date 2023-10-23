const express = require("express");
const {
  createBooking,
  cancelBooking,
  deleteBooking,
} = require("../controllers/booking");
const { getSingleBooking } = require("../controllers/user");
const { isLoggedIn } = require("../middlewares/middleware");
const router = express.Router();

router.route("/createBooking").post(isLoggedIn, createBooking);

router
  .route("/booking/:bookingId")
  .get(isLoggedIn, getSingleBooking)
  .put(isLoggedIn, cancelBooking)
  .delete(isLoggedIn, deleteBooking);

module.exports = router;
