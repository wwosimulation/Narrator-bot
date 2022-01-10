const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    index: {type: Number, default: 0},
    user: {type: String, required: true},
    reason: {type: String, default: "*No reason given*"},
    gamecode: {type: String, default: "*No game code given*"},
    date: {type: Date, default: () => {return Date.now()}},
})

module.exports = mongoose.model("gamewarns", schema)