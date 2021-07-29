const db = require("quick.db")

module.exports = {
    name: "mute",
    aliases: ["quiet", "shush"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-grumpy-grandma") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let night = await db.fetch(`nightCount`)
            let isNight = await db.fetch(`isNight`)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (parseInt(args[0]) > parseInt(alive.members.size) + parseInt(dead.members.size) || parseInt(args[0]) < 1) {
                return await message.reply("Invalid target!")
            } else if (args[0] === message.member.nickname) {
                return await message.reply("You can't mute yourself!")
            } else {
                if (isNight != "yes") {
                    return await message.reply("You can only do this during the night!")
                } else {
                    if (night == 1) {
                        return await message.reply("You can only mute a player after the first night!")
                    } else {
                        db.set(`mute_${message.channel.id}`, args[0])
                        message.react("475775342007549962")
                    }
                }
            }
        } else if (message.channel.name == "priv-hacker") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let night = await db.fetch(`nightCount`)
            let isNight = await db.fetch(`isNight`)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if(!guy) return message.reply("Invalid target!")
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let hacked = await db.fetch(`hack_${message.channel.id}`)
            if (parseInt(args[0]) > parseInt(alive.members.size) + parseInt(dead.members.size) || parseInt(args[0]) < 1) {
                return await message.reply("Invalid target!")
            } else if (args[0] === message.member.nickname) {
                return await message.reply("You can't mute yourself!")
            } else if (isNight != "yes") {
                return await message.reply("You can only do this during the night!")
            } else if (hacked == null) {
                return await message.reply("You haven't hacked anyone!")
            } else if (!hacked.includes(guy.nickname)) {
                return await message.reply("You can only mute people hacked!")
            } else if (db.get(`usedmute_${message.channel.id}`) == true) {
                return await message.reply("This is a one time command")
            } else {
                db.set(`mute_${message.channel.id}`, args[0])
                db.set(`usedmute_${message.channel.id}`, true)
                message.react("776460712008351776")
            }
        }
    },
}
