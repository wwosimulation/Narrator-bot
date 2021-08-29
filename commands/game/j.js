const db = require("quick.db")

module.exports = {
    name: "j",
    description: "Talk in the jail.",
    usage: `${process.env.PREFIX}j <message...>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name === "priv-jailer") {
            let night = db.get(`isNight`)
            if (night != "yes") return message.channel.send("You haven't jailed anyone yet.")
            let j = message.guild.channels.cache.find((c) => c.name === "jailed-chat")
            j.send("**Jailer**: " + args.join(" "))
        }

        if (message.channel.name === "jailed-chat") {
            let night = db.get(`isNight`)
            if (night != "yes") return message.channel.send("You haven't jailed anyone yet.")
            let js = message.guild.channels.cache.filter((c) => c.name === "priv-jailer").map((x) => x.id)
            for (let i = 0; i < js.length; i++) {
                let j = message.guild.channels.cache.get(js[i])
                for (let k = 1; k < 17; k++) {
                    let guy = message.guild.members.cache.find((m) => m.nickname === k.toString())
                    if (guy) {
                        if (j.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            j.send("**" + message.member.nickname + " " + message.author.username + "**: " + args.join(" "))
                        }
                    }
                }
            }
        }
    },
}
