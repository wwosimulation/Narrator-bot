const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: String }, // id of user that is banned
  reason: { type: String }, // reason user is banned
  mod: { type: String }, // mod who banned them
  date: { type: Date, default: Date.now } // time they were banned
});

module.exports = mongoose.model(`${__filename.split(`${__dirname}/`).pop().split(`.`).shift()}`, schema);