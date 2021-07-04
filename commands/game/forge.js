const db = require("quick.db")

module.exports = {
    name: "forge",
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
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("BRUH STOP. I ALREADY HAVE ENOUGH IDIOTS TRYING TO BREAK ME")

            if (isNight != "yes") return message.channel.send("Oi stupid, its still day...")

            if (given == false) return message.channel.send("You have to give an item before you can forge another item....dumb")

            if (forged == 2 || forged == 3) {
                db.set(`forging_${message.channel.id}`, db.get(`nightCount`))
                db.subtract(`forged_${message.channel.id}`, 1)
                db.set(`given_${message.channel.id}`, false)
                message.channel.send(`<:forgeshield:744536494458404876> You have started to forge a shield`)
            } else if (forged == 1) {
                db.set(`forging_${message.channel.id}`, db.get(`isNight`))
                db.subtract(`forged_${message.channel.id}`, 1)
                db.set(`given_${message.channel.id}`, false)
                message.channel.send(`<:forgesword:744536546266578996> You have started forging a sword!`)
            } else {
                return message.channel.send("Bruh just shut up. You already lost your forged items.")
            }
        }
    },
}
