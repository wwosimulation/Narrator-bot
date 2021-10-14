const db = require("quick.db")
const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "vt",
    description: "Start the voting time.",
    usage: `${process.env.PREFIX}vt <time...>`,
    narratorOnly: true,
    gameOnly: true,
    run: async (message, args, client) => {
        if (args[0] == "nm") return message.channel.send("Invalid format! The way you use this command has changed, check the pins in <#606123759514025985>")
        let timer = ms(args.join(" "))
        if (!timer) return message.channel.send("Invalid time!")
        let voteChat = message.guild.channels.cache.find((c) => c.name === "vote-chat")
        let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        let aliveRole = message.guild.roles.cache.find((r) => r.name === "Alive")
        db.set(`wwsVote`, "NO")
        db.set(`skippedpl`, 0)
        let votes = Math.floor(parseInt(aliveRole.members.size) / 2)
        dayChat.send(`Get ready to vote! (${votes} vote${votes == 1 ? "" : "s"} required)`)
        let droppy = new MessageSelectMenu().setCustomId("votephase")
        droppy.addOptions({ label: `Cancel`, value: `votefor-cancel`, description: `Cancel your vote` })
        for (let i = 1; i <= 16; i++) {
            console.log(i)
            let player = message.guild.members.cache.find((x) => x.nickname == `${i}` && x.roles.cache.has(aliveRole.id))
            if (player) {
                droppy.addOptions({ label: `${i}`, value: `votefor-${i}`, description: `${player.user.tag}` })
            }
        }
        let row = new MessageActionRow().addComponents(droppy)
        let m = voteChat.send({ content: `Timer set to ${ms(timer)} <@&${aliveRole.id}>`, components: [row] })
        db.set(`commandEnabled`, `yes`)
        db.add(`gamePhase`, 1)
        message.channel.send(`Setting the vote time for ${ms(timer)}`)
        setTimeout(() => {
            voteChat.send(`Time is up!`)
        }, timer)
    },
}
