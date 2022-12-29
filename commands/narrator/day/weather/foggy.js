const db = require("quick.db")

module.exports = async (message, client) => {
    db.set(`game.fog`, true)
}
