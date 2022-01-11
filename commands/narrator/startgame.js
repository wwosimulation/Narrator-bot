const { MessageActionRow } = require("discord.js")
const db = require("quick.db")
const shuffle = require("shuffle-array")
const { getEmoji } = require("../../config")

module.exports = {
    name: "startgame",
    description: "Start the game.",
    usage: `${process.env.PREFIX}startgame`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let mid = db.get("entermsg")
        // if (mid) {
        //     message.guild.channels.cache
        //         .find((x) => x.name == "enter-game")
        //         .messages.fetch(mid)
        //         .then((m) => {
        //             let allc = m.components
        //             let row = allc[0]
        //             let jgbutton = row.components[0]
        //             let specbutton = row.components[1]
        //             let narrbutton = row.components[2]
        //             jgbutton.disabled = true
        //             m.edit({ components: [new MessageActionRow().addComponents(jgbutton, specbutton, narrbutton)] })
        //         })
        // }
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")

        db.set(`gamePhase`, 0)
        db.set(`wwsVote`, "yes")
        db.set(`commandEnabled`, "no")

        // changing perms for alive in game-lobby
        message.guild.channels.cache.find((c) => c.name === "game-lobby").send("Game starting in 5 ...")

        setTimeout(async () => {
            message.guild.channels.cache.find((c) => c.name === "game-lobby").send("4")
        }, 1000)
        setTimeout(async () => {
            message.guild.channels.cache.find((c) => c.name === "game-lobby").send("3")
        }, 2000)
        setTimeout(async () => {
            message.guild.channels.cache.find((c) => c.name === "game-lobby").send("2")
        }, 3000)
        setTimeout(async () => {
            message.guild.channels.cache.find((c) => c.name === "game-lobby").send("1")
        }, 4000)
        setTimeout(async () => {
            message.guild.channels.cache
                .find((c) => c.name === "game-lobby")
                .permissionOverwrites.edit(alive.id, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: false,
                    VIEW_CHANNEL: false,
                })
        }, 5000)

        // changing perms for alive in day-chat
        message.guild.channels.cache
            .find((c) => c.name === "day-chat")
            .permissionOverwrites.edit(alive.id, {
                SEND_MESSAGES: false,
                READ_MESSAGE_HISTORY: true,
                VIEW_CHANNEL: true,
            })

        let allGr = []
        let gr = message.guild.channels.cache.filter((c) => c.name === "priv-grave-robber").map((x) => x.id)
        let grig = 0
        for (let i = 0; i < gr.length; i++) {
            for (let a = 1; a <= alive.members.size; a++) {
                let player = message.guild.members.cache.find((m) => m.nickname === a.toString())
                let chan = message.guild.channels.cache.get(gr[i])
                if (chan.permissionsFor(player).has(["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "VIEW_CHANNEL"])) {
                    grig = grig + 1
                    allGr.push(player.nickname)
                }
            }
        }

        let ap = []
        for (let i = 1; i <= alive.members.size; i++) {
            ap.push(i.toString())
        }

        shuffle(ap)
        let newppl = ap
        for (let x = 0; x < allGr.length; x++) {
            let thegr = message.guild.members.cache.find((m) => m.nickname === allGr[x])
            let abc = ap.splice(ap.indexOf(thegr.nickname), 1)
            console.log(newppl)
            let guy = message.guild.members.cache.find((m) => m.nickname === ap[Math.floor(Math.random() * ap.length)])
            let role = db.get(`role_${guy.id}`)
            do {
                abc = abc.splice(ap.indexOf(guy.nickname), 1)
                guy = message.guild.members.cache.find((m) => m.nickname === ap[Math.floor(Math.random() * ap.length)])
            } while (role === "Mayor" || role === "Flower Child" || role === "Pacifist" || role === "Cursed" || role === "Jailer" || role === "Marksman" || role === "Cupid" || role === "Medium" || role === "Seer" || role === "Seer Apprentice" || role === "Detective" || role === "Kitten Wolf" || role === "Wolf Pacifist" || role === "Wolf Seer" || role === "Sect Leader" || role === "Zombie" || role === "Bandit" || role === "Headhunter")
            if (guy) {
                for (let z = 0; z < gr.length; z++) {
                    let chan = message.guild.channels.cache.get(gr[z])
                    if (chan.permissionsFor(thegr).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        z = 99
                        chan.send(`Your target is **${guy.nickname} ${guy.user.username}**!`)
                        db.set(`target_${chan.id}`, guy.nickname)
                    }
                }
            }
            ap = newppl
            ap.push(abc)
        }

        let allHh = []

        let hh = message.guild.channels.cache.filter((c) => c.name === "priv-headhunter").map((x) => x.id)

        let hhig = 0
        for (let i = 0; i < hh.length; i++) {
            for (let a = 1; a <= alive.members.size; a++) {
                let player = message.guild.members.cache.find((m) => m.nickname === a.toString())
                let chan = message.guild.channels.cache.get(hh[i])
                if (chan.permissionsFor(player.id).has(["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "VIEW_CHANNEL"])) {
                    hhig = hhig + 1
                    allHh.push(hh[i])
                }
            }
        }

        let allPlayers = []
        for (let i = 1; i <= alive.members.size; i++) {
            allPlayers.push(i.toString())
        }

        shuffle(allPlayers)

        let gotTarget = null

        for (let o = 0; o < hhig; o++) {
            for (let p = 1; p <= alive.members.size; p++) {
                let guy = message.guild.members.cache.find((m) => m.nickname === allPlayers[p - 1])
                let role = db.get(`role_${guy.id}`)
                if (role == "Villager" || role == "Doctor" || role == "Bodyguard" || role == "Tough Guy" || role == "Jailer" || role == "Red Lady" || role == "Marksman" || role == "Seer" || role == "Aura Seer" || role == "Spirit Seer" || role == "Seer Apprentice" || role == "Detective" || role == "Sheriff" || role == "Medium" || role == "Witch" || role == "Forger" || role == "Avenger" || role == "Beast Hunter" || role == "Loudmouth" || role == "Fortune Teller" || role == "Grumpy Grandma" || role == "Cupid") {
                    p = 99
                    shuffle(allPlayers)
                    gotTarget = true
                    db.set(`hhtarget_${hh[o]}`, guy.nickname)
                    message.guild.channels.cache.get(allHh[o]).send(`${getEmoji("headhunter", client)} Your target is **${guy.nickname} ${guy.user.username}**!`)
                }
            }
            if (gotTarget != true) {
                message.channel.send("I could not find a valid target for the headhunter channel! To assign a new target, do `+sethhtarget [User to be the target] [Headhunter channel id]`\n\nHere is the channel id: " + hh[o])
            }
        }
        for (let x = 1; x <= alive.members.size; x++) {
            let guy = message.guild.members.cache.find((m) => m.nickname === x.toString())
            if (guy) {
                db.delete(`jwwtag_${guy.id}`)
                db.delete(`mouth_${guy.id}`)
                db.delete(`atag_${guy.id}`)
            }
        }
        message.channel.send("The game has started! Ping @Alive in #day-chat when you are ready to start Night 1")
        await client.channels.cache.find((c) => c.id === "606123818305585167").send("Game is starting. You can no longer join. Feel free to spectate!")
        let gamemode = db.get(`gamemode`)
        message.guild.channels.cache.find((x) => x.name == "enter-game").send(`A ${gamemode} game has started, you can no longer join. Feel free to spectate!`)
        db.set("started", "yes")
        db.delete(`gamemode`)
    },
}
