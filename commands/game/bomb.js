const db = require("quick.db")
const config = require("../../config")
/*
01 02 03 04
05 06 07 08
09 10 11 12
13 14 15 16
*/

module.exports = {
    name: "bomb",
    description: "Place your bombs as arsonist.",
    usage: `${process.env.PREFIX}bomb <player> <player> <player>`,
    aliases: ["explode"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-bomber") {
            let night = await db.fetch(`nightCount`)
            let didCmd = await db.fetch(`didCmd_${message.channel.id}`)
            let isNight = await db.fetch(`isNight`)
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let guy1 = message.guild.members.cache.find((m) => m.nickname === args[0])
            let guy2 = message.guild.members.cache.find((m) => m.nickname === args[1])
            let guy3 = message.guild.members.cache.find((m) => m.nickname === args[2])
            if (isNight != "yes") return await message.channel.send("Placing bombs in broad day light is good. You should do it often!")
            if (!args.length == 3) return await message.channel.send("I know you wanna be the arso but you're not. Select 3 players to place the bomb at.")
            if (!guy1 || !guy2 || !guy3) return await message.channel.send("Invalid Target!")
            if ((!guy1.roles.cache.has(alive.id) && !guy2.roles.cache.has(alive.id) && !guy3.roles.cache.has(alive.id)) || !ownself.roles.cache.has(alive.id)) return await message.channel.send("Listen, placing bombs aren't possible when dead or to dead players. Now be a lamb and SHUT UP. ")
            if (night == didCmd + 1 && night != 1) return await message.channel.send("You already placed the bombs yesterday. So no bombs for you.")
            let bombs = [args[0], args[1], args[2]]
            let bombPlacements = `${args[0]} ${args[1]} ${args[2]}`
            console.log(bombPlacements)
            console.log(bombs)
            //console.log(JSON.stringify(bombs) == '123' )
            if (config.bombPlacements.includes(bombPlacements)) {
                //return await message.channel.send(
                // "Honey, you can only place bombs vertically, horizontally or diagonally. Make sure they are in order. \n\n+bomb 7 6 5 - :x:\n+bomb 5 6 7 - :white_check_mark: "
                // );
                message.channel.send(`<:explode:745914819353509978> Placed bombs on **${guy1.user.username}**, **${guy2.user.username}** and **${guy3.user.username}**!`)

                if (bombs.includes(message.member.nickname)) {
                    bombs.splice(bombs.indexOf(message.author.id), 1)
                }
                db.set(`bombs_${message.channel.id}`, bombs)
                db.set(`didCmd_${message.channel.id}`, night)
                console.log(db.get(`bomb_${message.channel.id}`))
            } else {
                return await message.channel.send("Honey, you can only place bombs vertically, horizontally or diagonally. Make sure they are in order. \n\n+bomb 7 6 5 - :x:\n+bomb 5 6 7 - :white_check_mark:")
            }
        }
    },
}
