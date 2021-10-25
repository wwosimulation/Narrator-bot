const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "tag",
    description: "Select a target to be revealed or killed when you die.",
    usage: `${process.env.PREFIX}tag <player>`,
    aliases: ["revenge", "avenge", "target"],
    gameOnly: true,
    run: async (message, args, client) => {
        let gamePhase = db.get(`gamePhase`)
        let night = Math.floor(gamePhase / 3) + 1
        let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
        let jtag = await db.fetch(`jwwtag_${message.author.id}`)
        let atag = await db.fetch(`atag_${message.author.id}`)
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
        let dc
        if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
        let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
        if (message.channel.name == "priv-junior-werewolf") {
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (!args[0]) return message.channel.send("Who are you tagging? Mention the player.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`NO! just use \`+suicide\` (please don't)`)
            if (!guy) return message.reply("Invalid Target!")
            if (guy == message.member) return message.channel.send("You cannot tag yourself with you! lol")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            let role = db.get(`role_${guy.id}`)
            let player = role.toLowerCase()

            // check if the player tagged is a wolf or a sorcerer
            if (player.includes("wolf") || role == "Sorcerer") {
                return await message.reply("You can not tag your teammate!")
            }

            // check if the player tagged is a president
            if (role == "President") {
                return await message.reply("You can not tag the President!")
            }

            // check if the player tagged is a couple of the jww
            let lovers = message.guild.channels.cache.find((x) => x.name == "lovers")
            if (lovers.permissionsFor(ownself).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                if (lovers.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    return message.channel.send("You can not tag your couple!")
                }
            }

            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `jwwtag_${dc.chan.id}` : `jwwtag_${message.channel.id}`}`, args[0])
            message.react("475775484219752453")
        }
        if (message.channel.name == "priv-avenger") {
            if (night == 1) {
                if (gamePhase % 3 == 0) return message.channel.send("You can tag a player day 1 onwards.")
            }
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (!args[0]) return message.channel.send("Who are you tagging? Mention the player.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`NO! just use \`+suicide\` (please don't)`)
            if (!guy) return message.reply("The player is not in game! Mention the correct player number.")
            if (guy == message.member) return message.channel.send("You cannot tag yourself! lol")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")

            let role = db.get(`role_${guy.id}`)

            // check if the player tagged is the president
            if (role == "President") {
                return await message.reply("You can't tag the President!")
            }

            // check if the player tagged is a couple of the avenger
            let lovers = message.guild.channels.cache.find((x) => x.name == "lovers")
            if (lovers.permissionsFor(ownself).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                if (lovers.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    return message.channel.send("You can not tag your couple.")
                }
            }

            // check if the player tagged is a sect leader and if you are a sect member
            let sl = message.guild.channels.cache.find((x) => x.name == "sect-members")
            if (sl.permissionsFor(ownself).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                if (role == "Sect Leader") {
                    return message.channel.send("You cannot tag your sect leader being part of the sect!")
                }
            }

            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `atag_${dc.chan.id}` : `atag_${message.channel.id}`}`, args[0])
            message.react("482179367485702162")
        }
        if (message.channel.name == "priv-loudmouth") {
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")

            if (!args[0]) return message.channel.send("Who are you revealing? Mention the player.")

            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`Technically the loudmouth already is revealed when they die so this is pointless...`)

            if (!guy || guy == message.member || !guy.roles.cache.has(alive.id)) return message.reply("The player is not in game! Mention the correct player number.")

            if (night == 1) {
                if (gamePhase % 3 == 0) {
                    return message.channel.send("You can not select a player to reveal during the first night!")
                }
            }

            if (guy.roles.cache.has(revealed.id)) return message.channel.send("That player has already been revealed!")
            let role = db.get(`role_${guy.id}`)

            // check if the player tagged is a President
            if (role == "President") {
                return await message.reply("Everyone know who is the President.")
            }

            // check if the player tagged is a couple of the loudmouth
            let lovers = message.guild.channels.cache.find((x) => x.name == "lovers")
            if (lovers.permissionsFor(ownself).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                if (lovers.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    return message.channel.send("You can not reveal your couple!")
                }
            }

            // check if the player tagged is a sect leader and if you are a sect member
            let sl = message.guild.channels.cache.find((x) => x.name == "sect-members")
            if (sl.permissionsFor(ownself).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                if (role == "Sect Leader") {
                    return message.channel.send("You can not reveal the Sect Leader being part of the sect.")
                }
            }

            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `mouth_${dc.chan.id}` : `mouth_${message.channel.id}`}`, guy.nickname)
            message.channel.send(`${getEmoji("loudmouthing", client)} You selected **${guy.nickname} ${guy.user.username}** to be revealed when you die.`)
        }
    },
}
