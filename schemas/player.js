const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: { type: String, unique: true }, //user id
    balance: { type: Number, default: 0 }, //currency balance
    inventory: {
        cmi: { type: Boolean, default: false }, //true or false has the cmi
        profile: { type: Boolean, default: false }, //true or false has the profile cmd
        rose: { type: Number, default: 0 }, // number of roses
        bouquet: { type: Number, default: 0 }, // number of bouquets
        privatechannel: { type: String, default: "" }, //private channel ID
        customrole: { type: String, default: "" }, //custom role id
    }
});

module.exports = mongoose.model(`${__filename.split(`${__dirname}/`).pop().split(`.`).shift()}`, schema);