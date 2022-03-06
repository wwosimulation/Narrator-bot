const db = require("quick.db")
const { fn } = require("../../config")

module.exports = {
    name: "hack",
    description: "Hack people as hacker.",
    usage: `${process.env.PREFIX} <player> [player]`,
    gameOnly: true,
    run: async (message, args, client) => {
        let dc
        if (message.channel.name == "priv-hacker") {
            let gamePhase = db.get(`gamePhase`)
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
            if (args[0] == "cancel") {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `hack_${dc.chan.id}` : `hack_${message.channel.id}`}`, null)
                return message.channel.send("Okay, your action has been canceled")
            }
            let alrhacked = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `hashacked_${dc.chan.id}` : `hashacked_${message.channel.id}`}`)

            let illu = message.guild.channels.cache.filter((c) => c.name === "priv-illusionist").map((x) => x.id)
            let shaman = message.guild.channels.cache.filter((c) => c.name === "priv-wolf-shaman").map((x) => x.id)
            let firsthack = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `hack_${dc.chan.id}` : `hack_${message.channel.id}`}`) || []
            let sech = []
            let lol = firsthack
            firsthack.forEach((person) => lol.push(person))
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send(`You cannot use the ability now!`)
            if (!args[0]) return message.channel.send("who are you hacking? Mention the player.")
            if (gamePhase % 3 != 0) return message.channel.send("You can use your ability only at night!")
            if (args.length > 2) return message.channel.send("You cannot hack more than 2 players.")
            if (alrhacked) return message.channel.send("You have already hacked a player.")

            //gets players to hack
            for (let i = 0; i < args.length; i++) {
                //gets player
                let guy = message.guild.members.cache.find((m) => m.nickname === args[i]) || message.guild.members.cache.find((m) => m.id === args[i]) || message.guild.members.cache.find((m) => m.user.username === args[i]) || message.guild.members.cache.find((m) => m.user.tag === args[i])
                if (!guy) return message.channel.send(`Player **${args[i]}** could not be found!`)
                if (!guy.roles.cache.has(alive.id)) return message.channel.send(`Player **${guy.nickname} ${guy.user.username}** is dead!`)
                if (guy == message.member) return message.channel.send(`Hacking yourself isn't just gonna work!`)

                //if player is already hacked
                if (firsthack.includes(guy.nickname)) {
                    if (fn.peaceCheck(message, db) === true) return message.channel.send({ content: "We have a peaceful night. You can't hack anyone for the second time." })
                    sech.push(guy.nickname)
                    message.channel.send(`:white_check_mark: You decided to hack **${guy.nickname} ${guy.user.username}** to DEATH!`)

                    //if player is not already hacked
                } else {
                    //add player nickname to firsthack
                    lol.push(guy.nickname)
                    //gets player's role

                    let role = db.get(`role_${guy.id}`)

                    for (let i = 0; i < illu.length; i++) {
                        let disguised = db.get(`disguised_${illu[i]}`) || []
                        if (disguised.length != 0) {
                            if (disguised.includes[args[0]]) {
                                role == "Illusionist"
                            }
                        }
                    }
                    for (let i = 0; i < shaman.length; i++) {
                        let disguised = db.get(`shaman_${shaman[i]}`) || ""
                        if (disguised == args[0]) {
                            role = "Wolf Shaman"
                        }
                    }
                    //confirmation message with role
                    message.channel.send(`:white_check_mark: You decided to hack **${guy.nickname} ${guy.user.username} (${role})**!`)
                }
            }
            //adds player to hacked array
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `hack_${dc.chan.id}` : `hack_${message.channel.id}`}`, lol)
            //sets to show player has hacked this night
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `hashacked_${dc.chan.id}` : `hashacked_${message.channel.id}`}`, true)
            //adds people to die
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `secondhack_${dc.chan.id}` : `secondhack_${message.channel.id}`}`, sech)
        }
    },
}
