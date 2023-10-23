const express = require("express");
const {
  getAllTheater,
  addTheater,
  updateMovieStreamingInTheater,
  getTheaterSeatingArrangement,
  getTheatersBasedOnMovieAndLocation,
  updateTheaterLayout,
  getTheaterDetails,
  removeTheaterDetails,
  updateTheaterDetails,
  updateTheaterSeating,
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

router.put("/updateTheaterLayout", isLoggedIn, isAdmin, updateTheaterLayout);

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

router
  .route("/theater/:theaterId")
  .get(isLoggedIn, getTheaterDetails)
  .post(isLoggedIn, isAdmin, updateTheaterDetails)
  .put(isLoggedIn, isAdmin, updateTheaterSeating)
  .delete(isLoggedIn, isSuperAdmin, removeTheaterDetails);

module.exports = router;
