const db = require("quick.db")
const config = require("../../config")
const { ids } = require("../../config")

module.exports = {
    name: "heal",
    description: "Protect somebody so they won't be able to be attacked during the night.",
    usage: `${process.env.PREFIX}heal <player>`,
    aliases: ["protect", "save"],
    gameOnly: true,
    run: async (message, args, client) => {
        let gamePhase = await db.fetch(`gamePhase`)
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dc
        if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = config.fn.dcActions(message, db, alive)

        if (message.channel.name === "priv-doctor") {
            if (gamePhase % 3 != 0) {
                return await message.reply("You can only use this during the night!")
            } else {
                let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
                let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
                if (typeof dc === "undefined" && guy.id == message.author.id) return message.channel.send("You will not protect yourself, selfish prick.")
                if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`You will not force the doctor to protect themselves to make them look like they are selfish, that's pure evil!`)
                if (!guy) return await message.reply("The player is not in game! Mention the correct player number.")
                if (!guy.roles.cache.has(ids.alive) || !ownself.roles.cache.has(ids.alive)) return await message.reply("You or your target isn't alive!")
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `heal_${dc.chan.id}` : `heal_${message.channel.id}`}`, args[0])
                message.react("475775251297337344")
            }
            ;``
        } else if (message.channel.name === "priv-witch") {
            if (gamePhase % 3 != 0) {
                return await message.reply(`You can use the ability only at night!`)
            } else {
                let witch = await db.fetch(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `witchAbil_${dc.chan.id}` : `witchAbil_${message.channel.id}`}`)
                if (witch == 1) {
                    return await message.reply("You have already used your ability!")
                } else {
                    let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
                    let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
                    if (typeof dc === "undefined" && guy.id == ownself.id) return message.channel.send("You will not protect yourself, selfish prick.")
                    if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`You will not force the witch to protect themselves to make them look like they are selfish, that's pure evil!`)

                    if (!guy) return await message.reply("The player is not in game! Mention the correct player number.")
                    if (guy == ownself) return await message.channel.send("You cannot protect yourself.")
                    if (!guy.roles.cache.has(ids.alive) || !ownself.roles.cache.has(ids.alive)) return await message.reply("You can play with alive people only!")
                    db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `potion_${dc.chan.id}` : `potion_${message.channel.id}`}`, args[0])
                    message.react("596733389084819476")
                }
            }
        } else if (message.channel.name == "priv-bodyguard") {
            let lives = await db.fetch(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `lives_${dc.chan.id}` : `lives_${message.channel.id}`}`)
            if (lives == null) {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `lives_${dc.chan.id}` : `lives_${message.channel.id}`}`, 2)
                lives = await db.fetch(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `lives_${dc.chan.id}` : `lives_${message.channel.id}`}`)
            }
            //let protect = args[0]
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (!guy) return await message.reply("The player is not in game! Mention the correct player number.")
            if (typeof dc === "undefined" && guy.id == ownself.id) return message.channel.send("You will not protect yourself, selfish prick.")
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`You will not force the bodyguard to protect themselves to make them look like they are selfish, that's pure evil!`)
            if (!guy.roles.cache.has(ids.alive) || !ownself.roles.cache.has(ids.alive)) return await message.reply("You or your target isn't alive!")
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `guard_${dc.chan.id}` : `guard_${message.channel.id}`}`, args[0])
            message.react("475775137434697728")
        } else if (message.channel.name == "priv-tough-guy") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let gamePhase = db.get(`gamePhase`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (!args[0]) return message.channel.send("Who do you want to protect? Mention the player.")
            if (gamePhase % 3 != 0) return message.channel.send("You can use your ability only at night!")

            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            if (!guy) return message.reply("The player is not in game! Mention the correct player number.")
            if (typeof dc === "undefined" && guy.id == message.author.id) return message.channel.send("You will not protect yourself, selfish prick.")
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`You will not force the tough guy to protect themselves to make them look like they are selfish, that's pure evil!`)

            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")

            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `tough_${dc.chan.id}` : `tough_${message.channel.id}`}`, guy.nickname)
            message.react("606429479170080769")
        }
    },
}
