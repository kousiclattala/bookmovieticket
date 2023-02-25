const express = require("express");
const {
  addMovieDetails,
  getMoviesBasedonLocation,
} = require("../controllers/movie");
const { isLoggedIn, isSuperAdmin } = require("../middlewares/middleware");
const { response } = require("../utils/response");
const router = express.Router();

//* super admin routes
router.post(
  "/superAdmin/addMovieDetails",
  isLoggedIn,
  isSuperAdmin,
  addMovieDetails
);

//* user routes
router.get(
  "/user/getMoviesBasedonLocation/:locationName",
  isLoggedIn,
  getMoviesBasedonLocation
);

module.exports = router;
