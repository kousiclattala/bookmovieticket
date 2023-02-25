const express = require("express");
const {
  getAllTheater,
  addTheater,
  updateMovieStreamingInTheater,
  getTheaterSeatingArrangement,
  getTheatersBasedOnMovieAndLocation,
} = require("../controllers/theater");
const {
  isLoggedIn,
  isSuperAdmin,
  isAdmin,
} = require("../middlewares/middleware");
const { response } = require("../utils/response");
const router = express.Router();

router.get("/getAllTheaters", isLoggedIn, isSuperAdmin, getAllTheater);

router.post("/addTheater", isLoggedIn, isAdmin, addTheater);

router.put(
  "/updateMovieStreamingInTheater",
  isLoggedIn,
  isAdmin,
  updateMovieStreamingInTheater
);

router.get(
  "/getTheaterSeatingDetails",
  isLoggedIn,
  getTheaterSeatingArrangement
);

router.post(
  "/getTheatersBasedonLocationAndMovie",
  isLoggedIn,
  getTheatersBasedOnMovieAndLocation
);

module.exports = router;
