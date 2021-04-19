const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: { type: String, unique: true }, // user id
    coins: {type: Number, default: 0}, // coins aka balance
    roses: {type: Number, default: 0}, // roses CURRENCY
    roses: {type: Number, default: 0}, // gems
    inventory: {
        cmi: { type: Boolean, default: false }, // true or false has the cmi
        profile: { type: Boolean, default: false }, // true or false has the profile cmd
        profileDesc: {type: String, default: ""},  // description on the profile
        profileIcon: {type: String, default: ""}, // icon on the profile
        roses: { type: Number, default: 0 }, // inventory roses
        bouquet: { type: Number, default: 0 }, // number of bouquets
        privateChannel: { type: String, default: "" }, // private channel ID
        customRole: { type: String, default: "" }, // custom role id
    }
});

module.exports = mongoose.model(`${__filename.split(`${__dirname}/`).pop().split(`.`).shift()}`, schema);
