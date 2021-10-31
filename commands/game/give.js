const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "give",
    description: "Give something to another player. No matter what. A shield, a gift, cards or poisonous drinks!",
    usage: `${process.env.PREFIX}give <player | <red | black> player>`,
    run: async (message, args, client) => {
        let dc
        if (message.channel.name == "priv-fortune-teller") {
            let alive = message.guild.roles.cache.find((c) => c.name === "Alive")
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (!args[0] || args.length > 1) return message.channel.send("Who you want to give? Mention a player.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (typeof dc !== "undefined") if (guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`Haha, giving the fortune teller a fortune card! this can't get better.`)

            if (!guy || guy == message.member) return message.channel.send("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id) || guy == message.member) return message.channel.send("Player is not alive or you are trying to give a card to yourself!")
            let cards = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `cards_${dc.chan.id}` : `cards_${message.channel.id}`}`) || 2
            if (cards == 2) {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `cards_${dc.chan.id}` : `cards_${message.channel.id}`}`, 2)
            }
            if (cards < 1) return message.channel.send("You have given your cards already.")
            let role = db.get(`role_${guy.id}`)
            console.log()
            let channel = message.guild.channels.cache.filter((c) => c.name === "priv-" + role.toLowerCase().replace(" ", "-")).map((x) => x.id)
            for (let i = 0; i < channel.length; i++) {
                let iChan = message.guild.channels.cache.get(channel[i])
                if (iChan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    iChan.send(`${getEmoji("moon", client)} You have recieved a card from the Fortune Teller! Do +reveal to use it.`)
                    db.set(`card_${iChan.id}`, true)
                }
            }
            message.channel.send(`${getEmoji("moon", client)} You gave a card to **${guy.nickname} ${guy.user.username}**`)
            db.subtract(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `cards_${dc.chan.id}` : `cards_${message.channel.id}`}`, 1)
        } else if (message.channel.name == "priv-santa-claus") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            if (message.member.roles.cache.has(dead.id)) return message.channel.send("You cannot use the ability now!")
            if (!args[0]) return message.channel.send("You can use it as `+give ho` or `+give [player number]`")
            if (args[0] == "ho") {
                message.guild.channels.cache.find((c) => c.name === "day-chat").send("HO HO HO")
            } else {
                let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
                if (!guy || guy.nickname == message.member.nickname) return message.reply("The player is not in game! Mention the correct player number.")
                if (!guy.roles.cache.has(dead.id)) return message.channel.send("You can't send a gift to an alive player!")
                if (guy.presence.status === "offline") return message.channel.send("This player is offline!")
                guy.send("You have recieved a gift from Santa Claus! Find out what you have received!").catch((e) => message.channel.send(`An error occured: ${e.message}`))
                db.add(`roses_${guy.id}`, 1)
            }
        } else if (message.channel.name == "priv-forger") {
            let alive = message.guild.roles.cache.find((m) => m.name === "Alive")
            let gamePhase = db.get(`gamePhase`)
            let night = Math.floor(gamePhase / 3) + 1
            let forged = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `forged_${dc.chan.id}` : `forged_${message.channel.id}`}`)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find((m) => m.user.username === args.join(" ")) || message.guild.members.cache.find((m) => m.user.tag === args.join(" "))

            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (gamePhase % 3 != 0) return message.channel.send("You can use your ability only at night!")
            if (!args[0]) return message.channel.send("Who are you giving? Mention the player.")
            if (!guy) return message.reply("The player is not in game! Mention the correct player number.")
            if (typeof dc === "undefined" && guy.id == message.author.id) return message.channel.send("I dont get why I am not allowed to give the forger a shield/sword. What's the problem?")
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`I dont get why I am not allowed to give the forger a shield/sword. What's the problem?`)

            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")

            if (forged < 0) return message.channel.send("You have already used your ability.")
            if (db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `forging_${dc.chan.id}` : `forging_${message.channel.id}`}`) == Math.floor(gamePhase / 3) + 1) return message.channel.send("You cannot give the item now!")

            if (forged == 2 || forged == 1) {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `toGiveS_${dc.chan.id}` : `toGiveS_${message.channel.id}`}`, guy.nickname)
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `given_${dc.chan.id}` : `given_${message.channel.id}`}`, true)
                message.channel.send(`${fn.getEmoji("getshield", client)} You have decided to give the shield to **${guy.nickname} ${guy.user.username}**!`)
            } else {
                db.subtract(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `forged_${dc.chan.id}` : `forged_${message.channel.id}`}}`, 1)
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `toGiveK_${dc.tempguy.id}` : `toGiveK_${message.author.id}`}}`, guy.nickname)
                message.channel.send(`${fn.getEmoji("getsword", client)} You have decided to give the sword to  **${guy.nickname} ${guy.user.username}**!`)
            }
        } else if (message.channel.name == "priv-alchemist") {
            let gamePhase = db.get(`gamePhase`)
            if (gamePhase % 3 != 0) return message.channel.send("You can only do this at night!")
            if (fn.peaceCheck(message, db) === true) return message.channel.send({ content: "We have a peaceful night. You can't give potions to anyone." })
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[1]) || message.guild.members.cache.find((m) => m.user.username === args[1]) || message.guild.members.cache.find((m) => m.user.tag === args[1]) || message.guild.members.cache.find((m) => m.id === args[1])
            if (typeof dc !== "undefined") if (guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`Nope, you will not force the alchemist to give themselves a potion.`)
            if (args.length != 2) return message.channel.send("Who are you giving? Mention the player.")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (!guy || guy == message.member) return message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            if (!["red", "black"].includes(args[0].toLowerCase())) return message.channel.send("Which potion you are giving? Those are either `red` or `black`.")
            if (args[0].toLowerCase() == "red") {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `redpotion_${dc.chan.id}` : `redpotion_${message.channel.id}`}`, guy.nickname)
                message.react(fn.getEmoji("redp", client))
            } else if (args[0].toLowerCase() == "black") {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `blackpotion_${dc.chan.id}` : `blackpotion_${message.channel.id}`}`, guy.nickname)
                message.react(fn.getEmoji("blackp", client))
            }
        }
    },
}
