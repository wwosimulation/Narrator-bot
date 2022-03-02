const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    participants: { type: Array, default: [] },
    pot: { type: Number, default: 0 },
    ticketsBought: { type: Number, default: 0 },
    endDate: { type: String },
})

module.exports = mongoose.model("lottery", schema)
