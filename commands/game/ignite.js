const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "ignite",
    description: "Set all players you doused before on fire.",
    usage: `${process.env.PREFIX}ignite`,
    alises: ["burn", "fire"],
    gameOnly: true,
    run: async (message, args, client) => {
        let isNight = db.get(`isNight`)
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dc
        if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
        let doused = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `doused_${dc.chan.id}` : `doused_${message.channel.id}`}`) || []
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
        let didCmd = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `dousedAt_${dc.chan.id}` : `dousedAt_${message.channel.id}`}`) || "-1"
        if (message.channel.name == "priv-arsonist") {
            if (!message.member.roles.cache.has(alive.id)) return await message.channel.send("You cannot use the ability now!")
            if (isNight != "yes") return await message.channel.send("You can use your ability only at night!")

            if (didCmd == db.get(`nightCount`)) return message.channel.send("You have used your ability tonight.")
            if (doused.length == 0) return await message.channel.send("Who are you igniting? You haven't doused player yet.")

            for (let i = 0; i < doused.length; i++) {
                let guy = message.guild.members.cache.find((m) => m.nickname === doused[i])
                if (guy) {
                    if (guy.roles.cache.has(alive.id)) {
                        let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
                        let role = db.get(`role_${guy.id}`)
                        dayChat.send(`${getEmoji("ignite", client)} The Arsonist ignited **${guy.nickname} ${guy.user.username} (${role})**!`)
                        guy.roles.add(dead.id)
                        guy.roles.remove(alive.id)
                    }
                }
            }
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `ignitedAt_${dc.chan.id}` : `ignitedAt_${message.channel.id}`}`, db.get(`nightCount`))
            db.delete(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `doused_${dc.chan.id}` : `doused_${message.channel.id}`}`)
        }
    },
}
