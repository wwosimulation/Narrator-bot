const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    participants: { type: Array, default: [] },
    msg: { type: String, default: "" },
    pot: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    ticketsBought: { type: Number, default: 0 },
    endDate: { type: String, default: "" },
})

module.exports = mongoose.model("lottery", schema)
