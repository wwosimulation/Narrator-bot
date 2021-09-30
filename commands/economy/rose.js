const { players } = require("../../db.js")

module.exports = {
    name: "rose",
    description: "Send a rose bouquet or single roses to other users on the game server.",
    usage: `${process.env.PREFIX}rose <bouquet | single <user> [amount]>`,
    run: async (message, args, client) => {
        let data = await players.findOne({ user: message.author.id }).exec()
        let mininarr = message.guild.roles.cache.find((r) => r.name === "Narrator Trainee")
        let narrator = message.guild.roles.cache.find((r) => r.name === "Narrator")
        let spec = message.guild.roles.cache.find((r) => r.name === "Spectator")
        let alive = message.guild.roles.cache.find((r) => r.name === "Satan 😈")
        let dead = message.guild.roles.cache.find((r) => r.name === "test, ignore")

        /*
    if (message.member.roles.cache.has(spec.id)) return message.channel.send("You can't give the rose as a spectator!")
    if (message.member.roles.cache.has(mininarr.id) || message.member.roles.cache.has(narrator.id)) return message.channel.send("You can't give the rose as a narrator!")
    */

        if (!args[0]) return message.channel.send("You need to state if you want to give a rose to a player or as a bouquet!\n\nOptions: `single [player] [amount]` or `bouquet`")

        if (args[0] == "single") {
            let amount = parseInt(args[2])
            if (data.inventory.roses < amount) return message.channel.send(`You can't give ${amount} roses if you don't have that many in your inventory!`)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[1]) || message.guild.members.cache.find((m) => m.id === args[1]) || message.guild.members.cache.find((m) => m.user.username === args[1]) || message.guild.members.cache.find((m) => m.user.tag === args[1])
            if (!guy) return message.channel.send("Player does not exist!")
            if (message.member == guy) return message.channel.send("You cannot give a rose to yourself!")
            data.inventory.rose = data.inventory.rose - amount
            players.findOneAndUpdate({ user: guy.id }, { $inc: { roses: amount } }).exec()
            return message.channel.send(`You have successfully given ${args[1]} ${amount} rose${amount == 1 ? "" : "s"}!`)
        } else if (args[0] == "bouquet") {
            if (data.inventory.bouquet == 0) return message.channel.send("You don't have any bouquet!")
            for (let i = 0; i <= alive.members.size + dead.members.size; i++) {
                console.log(i)
                let guy = message.guild.members.cache.find((m) => m.nickname === i.toString())
                if (guy) {
                    console.log(guy.id)
                    players.findOneAndUpdate({ user: guy.id }, { $inc: { roses: 1 } }).exec()
                }
            }
            let bouquet = data.inventory.bouquet - 1
            players.findOneAndUpdate({ user: message.author.id }, { $set: { "data.inventory.bouquets": bouquet } })
            return message.channel.send(`You have successfully given a rose to every player in the server!`)
        }
        data.save()
    },
}
