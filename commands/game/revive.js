const db = require("quick.db")

module.exports = {
    name: "revive",
    description: "Revive a dead player.",
    usage: `${process.env.PREFIX}revive <player>`,
    aliases: ["rev", "resurrect"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-medium") {
            let jailed = message.guild.channels.cache.find((c) => c.name === "jailed-chat")
            if (jailed.permissionsFor(message.author.id).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) return message.channel.send("That player is jailed, you cannot revive them.")
            let abil = await db.get(`med_${message.channel.id}`)
            if (abil == "yes") return message.channel.send("You have already used your ability.")
            if (!args[0]) return await message.reply("Who are you reviving? Mention the player.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (!guy) return await message.channel.send("The player is not in game! Mention the correct player number.")
            if (guy == ownself) return await message.channel.send("You cannot revive yourself.")
            if (!guy.roles.cache.has("606131202814115882") || !ownself.roles.cache.has("606140092213624859")) return await message.channel.send("You cannot revive an alive player.")
            let night = await db.fetch(`isNight`)
            if (night != "yes") return await message.channel.send("You can use your ability only at night!")
            let role = db.get(`role_${guy.id}`)
            if (role.toLowerCase().includes("wolf") || role == "Fool" || role == "Headhunter" || role == "Sorcerer" || role == "Serial Killer" || role == "Arsonist" || role == "Bomber") return message.channel.send("You can only revive villagers.")
            if (guy.roles.cache.has("777400587276255262")) return message.channel.send("You can't revive corruted players!")
            db.set(`revive_${message.channel.id}`, args[0])
            message.react("767252118788243456")
        }
    },
}
