const express = require("express");
const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  updateUserRole,
  requestOtp,
  validateOtp,
  getUserDetails,
  getSingleUserDetails,
  getAllBookings,
  getSingleBooking,
} = require("../controllers/user");
const {
  isLoggedIn,
  isSuperAdmin,
  isAdmin,
  isValidToken,
} = require("../middlewares/middleware");
const { response } = require("../utils/response");
const router = express.Router();

//* user routes
router.post("/user/signup", signup);

router.post("/user/signin", signin);

router.post("/user/requestOtp", requestOtp);

router.post("/user/verifyOtp", validateOtp);

router.post("/user/forgotPassword", forgotPassword);

router.post("/user/resetPassword", resetPassword);

router.put("/user/updateUserProfile", isLoggedIn, updateUserProfile);

router.get("/user/getDetails", isLoggedIn, getUserDetails);

router.get(
  "/user/getUserDetails/:id",
  isLoggedIn,
  isSuperAdmin,
  getSingleUserDetails
);

router.get("/user/getAllBookings", isLoggedIn, getAllBookings);

router.get("/getSingleBooking/:bookingId", isLoggedIn, getSingleBooking);

router.get("/verifyToken", isValidToken);

//* superadmin routes
router.get(
  "/superAdmin/testSuperAdminMiddleware",
  isLoggedIn,
  isSuperAdmin,
  (req, res) => {
    res
      .status(200)
      .json(response(true, 200, "Super Admin Middleware is working"));
  }
);

router.post(
  "/superAdmin/updateUserRole",
  isLoggedIn,
  isSuperAdmin,
  updateUserRole
);

//* admin routes
router.get("/user/testAdminMiddleware", isLoggedIn, isAdmin, (req, res) => {
  res.status(200).json(response(true, 200, "Admin Middleware is working"));
});

module.exports = router;
