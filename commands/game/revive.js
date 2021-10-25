const db = require("quick.db")
const config = require("../../config")

module.exports = {
    name: "revive",
    description: "Revive a dead player.",
    usage: `${process.env.PREFIX}revive <player>`,
    aliases: ["rev", "resurrect"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-medium") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dc
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = config.fn.dcActions(message, db, alive)
            let jailed = message.guild.channels.cache.find((c) => c.name === "jailed-chat")
            if (jailed.permissionsFor(message.author.id).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) return message.channel.send("That player is jailed, you cannot revive them.")
            let abil = await db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `med_${dc.chan.id}` : `med_${message.channel.id}`}`)
            if (abil == "yes") return message.channel.send("You have already used your ability.")
            if (!args[0]) return await message.reply("Who are you reviving? Mention the player.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (!guy) return await message.channel.send("The player is not in game! Mention the correct player number.")
            if (guy == ownself) return await message.channel.send("You cannot revive yourself.")
            if (!guy.roles.cache.has(config.ids.dead)) return await message.channel.send("You cannot revive an alive player.")
            let gamePhase = await db.fetch(`gamePhase`)
            if (gamePhase % 3 != 0) return await message.channel.send("You can use your ability only at night!")
            let role = db.get(`role_${guy.id}`)
            if (role.toLowerCase().includes("wolf") || role == "Fool" || role == "Headhunter" || role == "Sorcerer" || role == "Serial Killer" || role == "Arsonist" || role == "Bomber") return message.channel.send("You can only revive villagers.")
            if (guy.roles.cache.has("777400587276255262")) return message.channel.send("You can't revive corruted players!")
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `revive_${dc.chan.id}` : `revive_${message.channel.id}`}`, args[0])
            message.channel.send("Done")
        }
    },
}
