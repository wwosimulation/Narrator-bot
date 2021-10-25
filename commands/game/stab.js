const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "stab",
    description: "Stab your knife into a living body.",
    usage: `${process.env.PREFIX}stab <player>`,
    aliases: ["murder"],
    gameOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dc
        if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
        if (message.channel.name == "priv-serial-killer") {
            if (args[0] == "cancel") {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `stab_${dc.chan.id}` : `stab_${message.channel.id}`}`, null)
                return message.channel.send("Okay, your action has been canceled")
            }
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0]) || message.guild.members.cache.find((m) => m.id === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`NO! just use \`+suicide\` (please don't)`)
            let gamePhase = db.get(`gamePhase`)
            if (gamePhase % 3 == 0 && fn.peaceCheck(message, db) === true) return message.channel.send({ content: "We have a peaceful night. You can't kill anyone." })
            if (!args[0]) return message.channel.send("Who are you stabbing? Mention the player.")
            if (!guy) return message.reply("The player is not in game! Mention the correct player number.")
            if (guy == message.member) return message.channel.send("Why are you stabbing yourself? lol")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (gamePhase % 3 != 0) return message.channel.send("You can use your ability only at night!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
            let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").map((x) => x.id)
            for (let x = 0; x < cupid.length; x++) {
                let couple = db.get(`couple_${cupid[x]}`) || [0, 0]
                if (message.author.nickname === couple[0]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[1]) return message.channel.send("You can not stab your lover!")
                }
                if (message.author.nickname === couple[1]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[0]) return message.channel.send("You can not stab your lover!")
                }
            }
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `stab_${dc.chan.id}` : `stab_${message.channel.id}`}`, guy.nickname)
            message.react("774088736861978666").catch((x) => message.react(fn.getEmoji("skknife", client)))
        } else if (message.channel.name == "priv-bandit" || message.channel.name == "priv-accomplice") {
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let allBandits = message.guild.channels.cache.filter((c) => c.name.startsWith("bandits")).map((x) => x.id)
            if (db.get(`gamePhase`) % 3 == 0 && fn.peaceCheck(message, db) === true) return message.channel.send({ content: "We have a peaceful night. You can't convert anyone." })
            if (message.channel.name == "priv-bandit") {
                for (let i = 0; i < allBandits.length; i++) {
                    let channel = message.guild.channels.cache.get(allBandits[i])
                    let playersInChannel = false
                    let ownself = message.guild.members.cache.find((m) => m.id === message.author.id)
                    if (channel.permissionsFor(ownself).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                            let player = message.guild.members.cache.find((m) => m.nickname === j.toString())
                            if (player && player.roles.cache.has(alive.id) && player != ownself) {
                                if (channel.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                    playersInChannel = true
                                }
                            }
                        }
                    }
                    if (playersInChannel == false) return message.channel.send("You need to convert a player before stabbing.")
                }
            }
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (!args[0]) return message.channel.send("Who are you stabbing? Mention the player.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy || guy.nickname == message.member.nickname) return message.channel.send("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
            let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").map((x) => x.id)
            for (let x = 0; x < cupid.length; x++) {
                let couple = db.get(`couple_${cupid[x]}`) || [0, 0]
                if (message.author.nickname === couple[0]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[1]) return message.channel.send("You can not stab your lover!")
                }
                if (message.author.nickname === couple[1]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[0]) return message.channel.send("You can not stab your lover!")
                }
            }
            for (let i = 0; i < allBandits.length; i++) {
                let chan = message.guild.channels.cache.get(allBandits[i])
                let ownself = message.guild.members.cache.find((m) => m.id === message.author.id)
                if (chan.permissionsFor(ownself).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        return message.channel.send("You cannot stab your teammates!")
                    }

                    i = 99
                    let emoji
                    if (message.channel.name == "priv-bandit") {
                        emoji = `${getEmoji("votebandit", client)}`
                        db.set(`banditkill_${chan.id}`, guy.nickname)
                    }
                    if (message.channel.name == "priv-accomplice") {
                        emoji = `${getEmoji("thieve", client)}`
                        db.set(`accomplice_${chan.id}`, guy.nickname)
                    }
                    chan.send(`${emoji} ${message.member.nickname} voted **${guy.nickname} ${guy.user.username}**`)
                }
            }
        }
    },
}
