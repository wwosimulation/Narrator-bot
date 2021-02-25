const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  channel: { type: String, unique: true }, // channel id
  didCmd: { type: Number, default: -1 }, 
  potions: { type: Number, default: 1 },
  poisons: { type: Number, default: 1 },
  heal: { type: String, default: "" },
  tough: { type: String, default: ""},
  guard: { type: String, default: ""},
  protect: { type: String, default: ""},
  lives: { type: Number, default: 2 },
  shields: { type: Number, default: 0 },
  trap: { type: String, default: "" },
  stab: { type: String, default: "" },
  kidnap: { type: String, default: "" },
  theif: { type: String, default: "" },
  glitch: { type: String, default: "" },
  douse: { type: Array, default: [] },
  
  
});

module.exports = mongoose.model(`${__filename.split(`${__dirname}/`).pop().split(`.`).shift()}`, schema);
