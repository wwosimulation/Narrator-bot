const { Client, GuildAuditLogsEntry } = require("discord.js")
const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "give",
    run: async (message, args, client) => {
        if (message.channel.name == "priv-fortune-teller") {
            let alive = message.guild.roles.cache.find((c) => c.name === "Alive")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You are not alive smart-A word")
            if (!args[0] || args.length > 1) return message.channel.send("No i don't know who you're talking about...")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            if (!guy || guy == message.member) return message.channel.send("Player does not exist!")
            if (!guy.roles.cache.has(alive.id) || guy == message.member) return message.channel.send("Player is not alive or you are trying to give a card to yourself!")
            let cards = db.get(`cards_${message.channel.id}`) || 2
            if (cards == 2) {
                db.set(`cards_${message.channel.id}`, 2)
            }
            if (cards < 1) return message.channel.send("You already gave all the cards moron...")
            let role = db.get(`role_${guy.id}`)
            console.log()
            let channel = message.guild.channels.cache.filter((c) => c.name === "priv-" + role.toLowerCase().replace(" ", "-")).keyArray("id")
            for (let i = 0; i < channel.length; i++) {
                let iChan = message.guild.channels.cache.get(channel[i])
                if (iChan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    iChan.send(`${getEmoji("moon", client)} You have recieved a card from the Fortune Teller! To use it, do +reveal`)
                    db.set(`card_${iChan.id}`, true)
                }
            }
            message.channel.send(`${getEmoji("moon", client)} You gave a card to **${guy.nickname} ${guy.user.username}**`)
            db.subtract(`cards_${message.channel.id}`, 1)
        } else if (message.channel.name == "priv-santa-claus") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            if (message.member.roles.cache.has(dead.id)) return message.channel.send("No you can't do this")
            if (!args[0]) return message.channel.send("You can use it as `+give ho` or `+give [player number]`")
            if (args[0] == "ho") {
                message.guild.channels.cache.find((c) => c.name === "day-chat").send("HO HO HO")
            } else {
                let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
                if (!guy || guy.nickname == message.member.nickname) return message.reply("Invalid target!")
                if (!guy.roles.cache.has(dead.id)) return message.channel.send("You can't send a gift to an alive player!")
                if (guy.presence.status === "offline") return message.channel.send("This player is offline!")
                guy.send("You have recieved a gift from Santa Claus! Find out what you have received!").catch((e) => message.channel.send(`An error occured: ${e.message}`))
                db.add(`roses_${guy.id}`, 1)
            }
        } else if (message.channel.name == "priv-forger") {
            let alive = message.guild.roles.cache.find((m) => m.name === "Alive")
            let isNight = db.get(`isNight`)
            let night = db.get(`nightCount`)
            let forged = db.get(`forged_${message.channel.id}`)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find((m) => m.user.username === args.join(" ")) || message.guild.members.cache.find((m) => m.user.tag === args.join(" "))

            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("Lmao, being stupid af")
            if (isNight != "yes") return message.channel.send("Bruh u can only do this during the night moron.")
            if (!args[0]) return message.channel.send("Bruh! You need to stop!")

            if (!guy) return message.reply("Invalid Target")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("BRUH THIS PLAYER IS NOT ALIVE STUPID")

            if (forged < 0) return message.channel.send("You already used up all your ability dumb")
            if (db.get(`forging_${message.channel.id}`) == db.get(`nightCount`)) return message.channel.send("YOU JUST FORGED AN ITEM BRUH WAIT A WHILE")
            if (db.get(`role_${message.author.id}`) != "dreamcatcher") {
                if (guy.id == message.author.id) return message.channel.send("Imagine giving something to yourself, lmao.")
                if (forged == 2 || forged == 1) {
                    db.set(`toGiveS_${message.channel.id}`, guy.nickname)
                    db.set(`given_${message.channel.id}`, true)
                    message.channel.send(`${getEmoji("getshield", client)} You have decided to give the shield to **${guy.nickname} ${guy.user.username}**!`)
                } else {
                    db.subtract(`forged_${message.channel.id}`, 1)
                    db.set(`toGiveK_${message.author.id}`, guy.nickname)
                    message.channel.send(`${getEmoji("getsword", client)} You have decided to give the sword to  **${guy.nickname} ${guy.user.username}**!`)
                }
            } else {
                let hypnotized = db.get(`hypnotized_${message.author.id}`)
                let guy1 = message.guild.members.cache.find((m) => m.nickname === hypnotized)
                let role = message.guild.channels.cache.filter((c) => c.name === `priv-${db.get(`role_${guy1.id}`).replace(" ", "-").toLowerCase()}`).map((x) => x.id)
                for (let b = 0; b < role.length; b++) {
                    let chan = message.guild.channels.cache.get(role[b])
                    if (chan.permissionsFor(guy1).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        for (let c = 1; c <= alive.members.size + dead.members.size; c++) {
                            if (guy1.roles.cache.has(alive.id)) {
                                if (forged == 2 || forged == 1) {
                                    db.set(`toGiveS_${chan.id}`, guy.nickname)
                                    db.set(`given_${chan.id}`, true)
                                    chan.send(`${getEmoji("getshield", client)} You have decided to give the shield to **${guy.nickname} ${guy.user.username}**!`)
                                    message.channel.send(`${getEmoji("getshield", client)} You have forced ${guy1.nickname} ${guy.user.username} to give the shield to **${guy.nickname} ${guy.user.username}**!`)
                                } else {
                                    db.subtract(`forged_${chan.channel.id}`, 1)
                                    db.set(`toGiveK_${guy1.id}`, guy.nickname)
                                    chan.send(`${getEmoji("getsword", client)} You have forced ${guy1.nickname} ${guy.user.username} to give the sword to  **${guy.nickname} ${guy.user.username}**!`)
                                }
                            }
                        }
                    }
                }
            }
        } else if (message.channel.name == "priv-alchemist") {
            let isNight = db.get(`isNight`)
            if (isNight == "no") return message.channel.send("You can only do this at night!")
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[1]) || message.guild.members.cache.find((m) => m.user.username === args[1]) || message.guild.members.cache.find((m) => m.user.tag === args[1]) || message.guild.members.cache.find((m) => m.id === args[1])
            if (args.length != 2) return message.channel.send("So you expect me to give no potion to the air? I am a killer, not a reviver dimwit")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("Bruh. No. Look at your roles before you do this command.")
            if (!guy || guy == message.member) return message.reply("Invalid Target!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("Stop . Just stop doing this to the Dead.")
            if (!["red", "black"].includes(args[0].toLowerCase())) return message.channel.send("Bruh, it is `red` or `black`. You are probably colour blind.")
            if (args[0].toLowerCase() == "red") {
                db.set(`redpotion_${message.channel.id}`, guy.nickname)
                message.react("821920816596910100")
            } else if (args[0].toLowerCase() == "black") {
                db.set(`blackpotion_${message.channel.id}`, guy.nickname)
                message.react("821920932989239296")
            }
        }
    },
}
