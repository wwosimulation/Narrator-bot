const db = require("quick.db")

module.exports = {
    name: "hack",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-hacker") {
            let isNight = db.get(`isNight`)
            let alrhacked = db.get(`hashacked_${message.channel.id}`)
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let illu = message.guild.channels.cache.filter((c) => c.name === "priv-illusionist").keyArray("id")
            let shaman = message.guild.channels.cache.filter((c) => c.name === "priv-wolf-shaman").keyArray("id")
            let firsthack = db.get(`hack_${message.channel.id}`) || []
            let lol = []
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send(`You flew right through the computer.`)
            if (!args[0]) return message.channel.send("Nice hacking no one i see")
            if (isNight != "yes") return message.channel.send("You should not want to be seen hacking")
            if (args.length > 2) return message.channel.send("Not not a pro, you can only hack 1 or 2 people")
            if (alrhacked) return message.channel.send("You have already hacked")

            //gets players to hack
            for (let i = 0; i < args.length; i++) {
                //gets player
                let guy = message.guild.members.cache.find((m) => m.nickname === args[i]) || message.guild.members.cache.find((m) => m.id === args[i]) || message.guild.members.cache.find((m) => m.user.username === args[i]) || message.guild.members.cache.find((m) => m.user.tag === args[i])
                if (!guy) return message.channel.send(`Player **${args[i]}** could not be found!`)
                if (!guy.roles.cache.has(alive.id)) return message.channel.send(`Player **${guy.nickname} ${guy.user.username}** is dead!`)
                if (guy == message.member) return message.channel.send(`Hacking yourself isn't just gonna work!`)

                //if player is already hacked
                if (firsthack.includes(guy.nickname)) {
                    for (let j = 0; j < args.length; j++) {
                        lol.push(guy.nickname)
                    }
                    db.set(`secondhack_${message.channel.id}`, lol)
                    message.channel.send(`:white_check_mark: You decided to hack **${guy.nickname} ${guy.user.username}** to DEATH!`)

                    //if player is not already hacked
                } else {
                    //add player nickname to firsthack
                    let lol = []
                    for (let j = 0; j < args.length; j++) {
                        lol.push(guy.nickname)
                    }
                    firsthack.forEach((person) => lol.push(person))
                    //gets player's role

                    for (let j = 0; j < args.length; j++) {
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
                    }

                    //adds player to hacked array
                    db.set(`hack_${message.channel.id}`, lol)
                    //sets to show player has hacked this night
                    db.set(`hashacked_${message.channel.id}`, true)
                    //confirmation message with role
                    message.channel.send(`:white_check_mark: You decided to hack **${guy.nickname} ${guy.user.username} (${role})**!`)
                }
            }
        }
    },
}
