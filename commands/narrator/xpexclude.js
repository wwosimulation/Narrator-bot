const db = require("quick.db")
module.exports = {
    name: "xpexclude",
    description: "Exclude pleayers from geeting xp with the +win command",
    usage: `${process.env.PREFIX}xpexclude <players...>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let ex = db.get("xpExclude")
        args.forEach((i) => ex.push(i))
        db.set("xpExclude", ex)
    },
}
