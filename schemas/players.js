const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user: { type: String, unique: true, required: true }, // user id
    coins: { type: Number, default: 25 }, // coins aka balance
    roses: { type: Number, default: 0 }, // roses CURRENCY
    gems: { type: Number, default: 0 }, // gems
    xp: { type: Number, default: 0 }, // xp
    cmi: { type: Boolean, default: false }, // true or false has the cmi
    profile: { type: Boolean, default: false }, // true or false has the profile cmd
    profileDesc: { type: String, default: "" }, // description on the profile
    profileIcon: { type: String, default: "" }, // icon on the profile
    privateChannel: { type: String, default: "" }, // private channel ID
    customRole: { type: String, default: "" }, // custom role id
    inventory: {
        description: { type: Number, default: 0 }, // description credits
        rose: { type: Number, default: 0 }, // inventory roses
        bouquet: { type: Number, default: 0 }, // number of bouquets
        lootbox: { type: Number, default: 0 }, // number of lootboxes
    },
    stats: {
        village: {
            win: { type: Number, default: 0 },
            lose: { type: Number, default: 0 },
        },
        werewolf: {
            win: { type: Number, default: 0 },
            lose: { type: Number, default: 0 },
        },
        couple: {
            win: { type: Number, default: 0 },
            lose: { type: Number, default: 0 },
        },
        sect: {
            win: { type: Number, default: 0 },
            lose: { type: Number, default: 0 },
        },
        zombie: {
            win: { type: Number, default: 0 },
            lose: { type: Number, default: 0 },
        },
        bandit: {
            win: { type: Number, default: 0 },
            lose: { type: Number, default: 0 },
        },
        solovoting: {
            win: { type: Number, default: 0 },
            lose: { type: Number, default: 0 },
        },
        solokiller: {
            win: { type: Number, default: 0 },
            lose: { type: Number, default: 0 },
        },
        tie: { type: Number, default: 0 },
    },
    daily: {
        last: { type: Number, default: 0 },
        day: { type: Number, default: 0 },
    },
    winStreak: { type: Number, default: 0 },
    language: { type: String, default: "en" },
    badges: { type: Object, default: { } },
})

module.exports = mongoose.model("players", schema)
