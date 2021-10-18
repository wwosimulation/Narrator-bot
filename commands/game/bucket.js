const { MessageActionRow, MessageSelectMenu } = require("discord.js")
const db = require("quick.db")
const shuffle = require("shuffle-array")
const { fn, ids } = require("../../config")



const emojis = ["🍬", "🍭", "🍫"]

module.exports = {
    name: "bucket",
    description: "Send your bucket to a player to ask for candy.",
    usage: `${process.env.PREFIX}bucket <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-pumpkin-king") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let lovers = message.guild.channels.cache.find((c) => c.name === "lovers")
            if (db.get(`pk_${message.channel.id}`)?.length > 0) return message.channel.send("You already sent your bucket!")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            db.set(`pk_${message.channel.id}`, [message.author.id])

            let droppy = new MessageSelectMenu().setCustomId("pumpkinking")
            droppy.addOptions({ label: `Return`, value: `${message.channel.id}-return`, description: `Return the bucket`, emoji: "🎃" })
            for (let i = 1; i <= 16; i++) {
                let player = message.guild.members.cache.find((x) => x.nickname == `${i}` && x.roles.cache.has(aliveRole.id))
                let chan = message.guild.channels.cache.filter((c) => c.name === `priv-`).map((x) => x.id)
                for (let j = 0; j < chan.length; j++) {
                    let tempchan = message.guild.channels.cache.get(chan[j])
                    if (tempchan.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        shuffle(emojis)
                        droppy.addOptions({ label: `${i}`, value: `${message.channel.id}-pass:${i}`, description: `Pass the bucket to ${player.user.tag}`, emoji: emojis[0] })
                    }
                }
            }
            let row = new MessageActionRow().addComponents(droppy)
            let sendChan
            let chan = message.guild.channels.cache.filter((c) => c.name === `priv-`).map((x) => x.id)
            for (let j = 0; j < chan.length; j++) {
                let tempchan = message.guild.channels.cache.get(chan[j])
                if (tempchan.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    sendChan = tempchan
                    break
                }
            }
            sendChan.send({ content: `<@&${ids.alive}>, you have been passed the candy bucket from the Pumpkin King! ${fn.getEmoji("pumpkinking")}\nYou may either choose to pass the bucket to another player or return it to the Pumpkin King!`, components: [row] })
        }
    },
}
