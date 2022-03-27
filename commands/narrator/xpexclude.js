const db = require("quick.db")
module.exports = {
    name: "unlock",
    description: "Unlock the day-chat channel.",
    usage: `${process.env.PREFIX}unlock`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let ex = db.get("xpExclude")
        args.forEach(i => ex.push(i))
        db.set("xpExclude", ex)
    },
}