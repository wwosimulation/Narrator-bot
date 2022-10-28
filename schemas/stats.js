const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    games: { type: Array, default: [] },
})

module.exports = mongoose.model("stats", schema)
