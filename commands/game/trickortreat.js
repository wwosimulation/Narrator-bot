const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "trickortreat",
    description: "Select 2 people that will have to choose between trick or treat during the night. and select which option will kill them",
    usage: `${process.env.PREFIX}trickortreat <target1> <target2> <trick/treat>`,
    aliases: ["trick", "tot", "treat"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-jack") {
            let isDay = db.get(`isDay`)
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let guy1 = message.guild.members.cache.find((m) => m.nickname === args[0])
            let guy2 = message.guild.members.cache.find((m) => m.nickname === args[1])
            if (isDay == "no") return message.channel.send("You can only select a option during the day.")
            if (!ownself.roles.cache.has(alive.id)) return message.channel.send("You are dead.")
            if (!guy1 || !guy2) return message.channel.send("Please select 2 players...")
            if (!guy1.roles.cache.has(alive.id) || !guy2.roles.cache.has(alive.id)) return message.channel.send("One of the players you selected is dead.")
            if (args[2] == "trick") {
                db.set(`punish_${message.channel.id}`, "trick")
            } else if (args[2] == "treat") {
                db.set(`punish_${message.channel.id}`, "treat")
            } else {
                message.channel.send(`That's not a valid option, either select trick or treat!`)
            }
            if (guy1 == ownself || guy2 == ownself) return message.channel.send("You canmot select yourself")
            if (guy1 == guy2) return message.channel.send("You cannot select the same person")
            if (db.get(`punish_${message.channel.id}`) == null) return message.channel.send("Please select which option will cause death first with `+punish`")
            db.set(`trickortreat_${message.channel.id}`, [args[0], args[1]])
            message.channel.send(`You have selected **${guy1.nickname} ${guy1.user.username}** and **${guy2.nickname} ${guy2.user.username}**, the option that will be punished is **${args[2]}**`)
        }
    },
}
