const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    index: { type: Number, index: true, unique: true, default: async () => {
        await mongoose.model("gamewarns", schema).find({}).transform((doc) => doc.length)
    }},
    user: { type: String, required: true },
    reason: { type: String, default: "*No reason given*" },
    gamecode: { type: String, default: "*No game code given*" },
    date: {
        type: Date,
        default: () => {
            return Date.now()
        },
    },
})

module.exports = mongoose.model("gamewarns", schema)
