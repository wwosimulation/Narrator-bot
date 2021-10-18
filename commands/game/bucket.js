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
            if (db.get(`pk_${message.channel.id}`)?.length > 0) return message.channel.send("You already sent your bucket!")
            if (args[0] == message.member.nickname) return message.channel.send("You can't pass the bucket to yourself!")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            let droppy = new MessageSelectMenu().setCustomId("pumpkinking")
            droppy.addOptions({ label: `Return`, value: `${message.channel.id}-return`, description: `Return the bucket`, emoji: "🎃" })
            for (let i = 1; i <= 16; i++) {
                let player = message.guild.members.cache.find((x) => x.nickname == `${i}` && x.roles.cache.has(ids.alive))
                let chan = message.guild.channels.cache.filter((c) => c.name.startsWith(`priv-`)).map((x) => x.id)
                for (let j = 0; j < chan.length; j++) {
                    let tempchan = message.guild.channels.cache.get(chan[j])
                    if (player && tempchan.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        shuffle(emojis)
                        droppy.addOptions({ label: `${i}`, value: `${message.channel.id}-pass:${tempchan.id}`, description: `Pass the bucket to ${player.user.tag}`, emoji: emojis[0] })
                    }
                }
            }
            let row = new MessageActionRow().addComponents(droppy)
            let chan = message.guild.channels.cache
                .filter((c) => c.name.startsWith(`priv-`))
                .forEach((x) => {
                    if (x.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        x.send({ content: `<@&${ids.alive}>, you have been passed the candy bucket from the Pumpkin King! ${fn.getEmoji("pumpkinking", client)}\nYou may either choose to pass the bucket to another player or return it to the Pumpkin King!`, components: [row] })
                    }
                })
            db.set(`pk_${message.channel.id}`, [message.author.id])
            message.react(fn.getEmoji("pumpkinking", client))
        }
    },
}
