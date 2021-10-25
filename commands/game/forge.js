const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "forge",
    description: "This command forges shields and swords.",
    usage: `${process.env.PREFIX}forge`,
    gameOnly: true,
    run: async (message, args, client) => {
        let dc
        if (message.channel.name == "priv-forger") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
            let gamePhase = db.get(`gamePhase`)
            let given = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `given_${dc.chan.id}` : `given_${message.channel.id}`}`)

            if (!db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `forged_${dc.chan.id}` : `forged_${message.channel.id}`}`)) {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `forged_${dc.chan.id}` : `forged_${message.channel.id}`}`, 3)
            }

            console.log(given)
            let forged = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `forged_${dc.chan.id}` : `forged_${message.channel.id}`}`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")

            if (gamePhase % 3 != 0) return message.channel.send("You can use your ability only at night!")

            if (given == false) return message.channel.send("You have to give an item before you can forge another item.")

            if (forged == 2 || forged == 3) {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `forging_${dc.chan.id}` : `forging_${message.channel.id}`}`, Math.floor(gamePhase / 3) + 1)
                db.subtract(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `forged_${dc.chan.id}` : `forged_${message.channel.id}`}`, 1)
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `given_${dc.chan.id}` : `given_${message.channel.id}`}`, false)
                message.channel.send(`${getEmoji("forgeshield", client)} You have started to forge a shield!`)
            } else if (forged == 1) {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `forging_${dc.chan.id}` : `forging_${message.channel.id}`}`, db.get(`gamePhase`) % 3 == 0 ? true : false)
                db.subtract(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `forged_${dc.chan.id}` : `forged_${message.channel.id}`}`, 1)
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `given_${dc.chan.id}` : `given_${message.channel.id}`}`, false)
                message.channel.send(`${getEmoji("forgesword", client)} You have started forging a sword!`)
            } else {
                return message.channel.send("You can no loger forge items!")
            }
        }
    },
}
