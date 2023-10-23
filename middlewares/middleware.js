const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger");
const { response } = require("../utils/response");

exports.isLoggedIn = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (token == null) {
      return res.status(401).json(response(false, 401, "Unauthorized"));
    } else {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      var user = await User.findById(decoded.id);

      if (user == null) {
        return res.status(401).json(response(false, 401, "Invalid token"));
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    res.status(400).json(response(false, 400, "Something went wrong", error));
  }
};

exports.isSuperAdmin = async (req, res, next) => {
  try {
    var token = req.header("Authorization").replace("Bearer ", "");

    if (token == null) {
      return res.status(404).json(response(false, 404, "Token is missing"));
    } else {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      var user = await User.findById(decoded.id);

      if (user == null) {
        return res.status(404).json(response(false, 404, "Invalid token"));
      }

      if (user.role !== "superadmin") {
        return res
          .status(401)
          .json(
            response(false, 401, "you're not authorized to access this route")
          );
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    res.status(400).json(response(false, 400, "Something went wrong", error));
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    var token = req.header("Authorization").replace("Bearer ", "");

    if (token == null) {
      return res.status(404).json(response(false, 404, "Token is missing"));
    } else {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      var user = await User.findById(decoded.id);

      if (user == null) {
        return res.status(404).json(response(false, 404, "Invalid token"));
      }

      if (user.role !== "admin") {
        return res
          .status(401)
          .json(
            response(false, 401, "you're not authorized to access this route")
          );
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    res.status(400).json(response(false, 400, "Something went wrong", error));
  }
};

exports.isValidToken = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
      if (err) {
        return res.status(400).json(
          response(false, 400, "Token is expired", {
            isValidToken: false,
          })
        );
      } else {
        return res.status(200).json(
          response(true, 200, "Token is valid", {
            isValidToken: true,
          })
        );
      }
    });
  } catch (error) {
    res
      .status(400)
      .json(response(false, 400, "Error in validating token", error));
  }
};
