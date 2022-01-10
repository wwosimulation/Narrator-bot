const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user: {type: String, required: true},
    reason: {type: String, }
})