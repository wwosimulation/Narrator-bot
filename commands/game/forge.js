const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "forge",
    description: "This command forges shields and swords.",
    usage: `${process.env.PREFIX}forge`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-forger") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let isNight = db.get(`isNight`)
            let given = db.get(`given_${message.channel.id}`)

            if (!db.get(`forged_${message.channel.id}`)) {
                db.set(`forged_${message.channel.id}`, 3)
            }

            console.log(given)
            let forged = db.get(`forged_${message.channel.id}`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")

            if (isNight != "yes") return message.channel.send("You can use your ability only at night!")

            if (given == false) return message.channel.send("You have to give an item before you can forge another item.")

            if (forged == 2 || forged == 3) {
                db.set(`forging_${message.channel.id}`, db.get(`nightCount`))
                db.subtract(`forged_${message.channel.id}`, 1)
                db.set(`given_${message.channel.id}`, false)
                message.channel.send(`${getEmoji("forgeshield", client)} You have started to forge a shield!`)
            } else if (forged == 1) {
                db.set(`forging_${message.channel.id}`, db.get(`isNight`))
                db.subtract(`forged_${message.channel.id}`, 1)
                db.set(`given_${message.channel.id}`, false)
                message.channel.send(`${getEmoji("forgesword", client)} You have started forging a sword!`)
            } else {
                return message.channel.send("You can no loger forge items!")
            }
        }
    },
}
