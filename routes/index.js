const express = require("express");
const router = express.Router();

const userRoute = require("./user");
const movieRoute = require("./movie");
const theaterRoute = require("./theater");
const bookingRoute = require("./booking");

router.use("/api/v1", userRoute);
router.use("/api/v1", movieRoute);
router.use("/api/v1", theaterRoute);
router.use("/api/v1", bookingRoute);

module.exports = router;
