const mongoose = require("mongoose")
const qdb = require("quick.db")

const schema = new mongoose.Schema({
    index: {
        type: Number,
        index: true,
        unique: true,
        default: () => {
            qdb.set("gamewarnIndex", qdb.get("gamewarnIndex") + 1)
            return qdb.get("gamewarnIndex")
        },
    },
    user: { type: String, required: true },
    reason: { type: String, default: "*No reason given*" },
    gamecode: { type: String, default: "*No game code given*" },
    date: {
        type: Date,
        default: () => {
            return new Date().getTime()
        },
    },
})

module.exports = mongoose.model("gamewarns", schema)
