const Discord = require("discord.js")
const { ids } = require("../../config")
const db = require("quick.db")
let voteForwws = ["0"]
function terrorCheck(message) {
    let prog = message.guild.channels.cache.filter((c) => c.name === "priv-prognosticator").map((x) => x.id)
    let dayCount = Math.floor(db.get(`gamePhase`) / 3) + 1
    let res = false
    for (let i = 0; i < prog.length; i++) {
        let terrorDay = db.get(`terror_${prog[i]}.day`) || "no"
        let terrorGuy = db.get(`terror_${prog[i]}.guy`) || "no"
        if (terrorDay !== "no" && terrorGuy !== "no" && terrorDay >= dayCount && message.member.nickname === terrorGuy) res = true
    }
    return res
}

module.exports = {
    name: "vote",
    description: "Vote someone to get them possibly killed.",
    usage: `${process.env.PREFIX}vote <player | cancel>`,
    gameOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
        let wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let wwvote = message.guild.channels.cache.find((c) => c.name === "ww-vote")
        let wwsVote = await db.fetch(`wwsVote`)
        let commandEnabled = await db.fetch(`commandEnabled`)
        let voteBanned = terrorCheck(message)
        if (wwsVote == "yes") {
            if (!message.channel.name.includes("wolf")) return

            let voted = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0])
            if (message.member.roles.cache.has(dead.id)) return message.channel.send("You cannot use the ability now!")
            if (!voted && args[0] != "cancel") return message.channel.send("The player is not in game! Mention the correct player number.")

            if (args[0] == "cancel") {
                let tmtd = db.get(`wwkillmsg_${message.channel.id}`)
                if (tmtd) {
                    let a = await wwvote.messages.fetch(tmtd)
                    if (a) {
                        await a.delete()
                        db.delete(`wolvesKill_${message.author.id}`)
                        return
                    }
                } else {
                    return message.channel.send("Hey you haven't voted yet!")
                }
            }

            if (voted == message.member) return message.channel.send("You cannot vote yourself!")
            if (!voted.roles.cache.has(alive.id)) return message.channel.send("You can not vote a dead player!")

            if (db.get(`role_${message.author.id}`) == "Wolf Seer") {
                if (db.get(`resigned_${message.channel.id}`) != true) {
                    for (let j = 1; j <= 16; j++) {
                        let tempguy = message.guild.members.cache.find((m) => m.nickname === j.toString())
                        if (tempguy) {
                            if (tempguy.roles.cache.has(alive.id)) {
                                if (db.get(`role_${tempguy.id}`).toLowerCase().includes("wolf")) {
                                    return message.channel.send("You need to resign in order to vote.")
                                }
                            }
                        }
                    }
                }
            }
            if (db.get(`role_${voted.id}`).toLowerCase().includes("wolf") || db.get(`role_${voted.id}`).toLowerCase().includes("sorcerer")) return message.channel.send("Voting your teammates causes gamethrowing you know")

            let bv = db.get(`wwkillmsg_${message.channel.id}`)
            if (bv) {
                let thems = await wwvote.messages.fetch(bv).catch((e) => console.log(e.message))
                if (thems) {
                    await thems.delete()
                }
            }
            let vb = await wwvote.send(`${message.member.nickname} voted ${args[0]}`)
            let mid = vb.id
            db.set(`wwkillmsg_${message.channel.id}`, mid)
            db.set(`wolvesKill_${message.author.id}`, voted.nickname)
        }
        if (commandEnabled == "yes") {
            if (!message.channel.name.includes("priv")) {
                return
            } else {
                if (voteBanned) message.channel.send({ content: "The Prognosticator prevents you from voting." })
                if (message.channel.name == "priv-idiot") {
                    let killed = await db.fetch(`idiot_${message.channel.id}`)
                    if (killed == "yes") return await message.channel.send("You cannot vote now!")
                }
                let votedGuy = message.guild.members.cache.find((m) => m.nickname === args[0])
                let voteChat = message.guild.channels.cache.find((c) => c.name === "vote-chat")
                if (args[0] == "cancel") {
                    let bruh = db.get(`votemsgid_${message.channel.id}`)
                    if (bruh) {
                        let godei = await voteChat.messages.fetch(bruh)
                        if (godei) {
                            await godei.delete()
                            return
                        }
                    }
                }
                if (!votedGuy || votedGuy.roles.cache.has(dead.id) || votedGuy == message.member) {
                    return await message.reply("The player is not in game! Mention the correct player number.")
                } else if (!votedGuy.roles.cache.has(ids.alive) || !message.member.roles.cache.has(ids.alive)) {
                    return await message.reply("You can play with alive people only!")
                } else {
                    let voteChat = message.guild.channels.cache.find((c) => c.name === "vote-chat")

                    //voteChat.send(`${message.member.nickname} voted ${args[0]}`);
                    let voted = message.guild.members.cache.find((m) => m.nickname === args[0])
                    let votes = ["0"]
                    if (args[0] == message.member.nickname) {
                        return message.reply("You can not vote yourself!")
                    } else {
                        let voted = db.get(`votemsgid_${message.channel.id}`)
                        if (voted) {
                            let tmestodel = await voteChat.messages.fetch(voted).catch((e) => console.log(e.message))
                            if (tmestodel) {
                                await tmestodel.delete()
                            }
                        }
                        let omg = await voteChat.send(`${message.member.nickname} voted ${args[0]}`)
                        votes.push(args[0])
                        db.set(`vote_${message.author.id}`, args[0])
                        db.set(`votemsgid_${message.channel.id}`, omg.id)
                    }
                }
            }
        }
    },
}
