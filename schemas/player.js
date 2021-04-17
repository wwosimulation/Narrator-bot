const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: { type: String, unique: true }, // user id
    coins: {type: Number, default: 0}, // coins aka balance
    roses: {type: Number, default: 0}, // roses CURRENCY
    inventory: {
        cmi: { type: Boolean, default: false }, // true or false has the cmi
        profile: { type: Boolean, default: false }, // true or false has the profile cmd
        roseG: { type: Number, default: 0 }, // number of roses bought
        rose: { type: Number, default: 0 }, // number of roses to be used
        bouquet: { type: Number, default: 0 }, // number of bouquets
        privatechannel: { type: String, default: "" }, // private channel ID
        customrole: { type: String, default: "" }, // custom role id
    }
});

module.exports = mongoose.model(`${__filename.split(`${__dirname}/`).pop().split(`.`).shift()}`, schema);
