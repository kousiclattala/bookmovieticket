const { EMAIL_REGEX } = require("./constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.validateEmail = (val) => {
  return EMAIL_REGEX.test(val);
};

exports.generateAuthToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.TOKEN_SECRET, {
    expiresIn: "2 days",
  });

  return token;
};

exports.generateHashedPassword = (password) => {
  const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
  const passwordHash = bcrypt.hashSync(password, salt);

  return passwordHash;
};

exports.generateRandomNumber = () => {
  var val = Math.floor(1000 + Math.random() * 9000);

  return val;
};
