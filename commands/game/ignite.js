const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "ignite",
    alises: ["burn", "fire"],
    gameOnly: true,
    run: async (message, args, client) => {
        let isNight = db.get(`isNight`)
        let doused = db.get(`doused_${message.channel.id}`) || []
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
        let didCmd = db.get(`dousedAt_${message.channel.id}`) || "-1"
        if (message.channel.name == "priv-arsonist") {
            if (!message.member.roles.cache.has(alive.id)) return await message.channel.send("You cannot use the ability now!")
            if (isNight != "yes") return await message.channel.send("You can use your ability only at night!")
            if (fn.peaceCheck(message, db) === true) return message.channel.send({content:"We have a peaceful night. You can't convert anyone."})

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
            db.set(`ignitedAt_${message.channel.id}`, db.get(`nightCount`))
            db.delete(`doused_${message.channel.id}`)
        }
    },
}
