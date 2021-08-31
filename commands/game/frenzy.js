const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "frenzy",
    description: "Activate the frenzy!",
    usage: `${process.env.PREFIX}frenzy`,
    gameOnly: true,
    run: async (message, args, client) => {
        let dc
        if (message.channel.name == "priv-werewolf-berserk") {
            const alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
            const wolfChat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
            const abil = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `abil_${dc.chan.id}` : `abil_${message.channel.id}`}`) || "no"

            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")

            if (abil == "yes") return message.channel.send("You have used your ability already.")

            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `frenzy_${dc.chan.id}` : `frenzy_${message.channel.id}`}`, true)
            message.react("744573088204718412")
            wolfChat.send(`${getEmoji("frenzy", client)} The Werewolf Berserk has activated it's frenzy tonight!`)
        }
    },
}
