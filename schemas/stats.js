const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    games: { type: Array, default: [] },
    members: { type: Array, default: [] },
    previousFetch: { type: Array, default: [] },
    newFetch: { type: Date, default: Date.now() },
})

module.exports = mongoose.model("stats", schema)
