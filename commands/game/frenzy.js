const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "frenzy",
    description: "Activate the frenzy!",
    usage: `${process.env.PREFIX}frenzy`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-werewolf-berserk") {
            const alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
            const wolfChat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
            let gamePhase = db.get(`gamePhase`)
            const abil = db.get(`abil_${message.channel.id}`) || "no"

            if (gamePhase % 3 == 0) return message.channel.send("You can only use frenzy during the day!")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")

            if (abil == "yes") return message.channel.send("You have used your ability already.")

            db.set(`frenzy_${message.channel.id}`, true)
            db.set(`abil_${message.channel.id}`, "yes")
            message.react("744573088204718412")
            wolfChat.send(`${getEmoji("frenzy", client)} The Werewolf Berserk has activated it's frenzy tonight!`)
        }
    },
}
