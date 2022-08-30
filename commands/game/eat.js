const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "eat",
    description: "Eat players as the Cannibal.",
    usage: `${process.env.PREFIX}eat <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to eat players.")
        if (!["Cannibal"].includes(player.role) && !["Cannibal"].includes(player.dreamRole)) return
        if (["Cannibal"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only eat during the night right? Or are you delusional?")
        if (db.get(`game.peace`) === Math.floor(gamePhase / 3) + 1) return await message.channel.send("This is a peaceful night! You cannot eat anyone!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")

        if (args[0] === "cancel") {
            db.delete(`player_${player.id}.target`)
            return await message.channel.send(`${getEmoji("corrupt", client)} Your actions have been canceled!`)
        }

        if (args.length > player.uses) return await message.channel.send(`Hey there! You cannot eat more than you can handle! Currently, you can only eat **${player.uses}** players.`)

        let target = []

        for (const arg of args) {
            let guy = players[Number(arg) - 1] || players.find((p) => p === arg) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === arg)

            if (!guy) {
                await message.channel.send(`I could not find the player with the following query: \`${arg}\``)
                break
            }

            if (db.get(`player_${guy}`).status !== "Alive") {
                await message.channel.send("You do know you can only eat ALIVE players right? Remember cannibalism?")
                break
            }

            if (db.get(`player_${guy}`).role === "President") {
                await message.channel.send("You cannot eat the President!")
                break
            }

            if (!player.hypnotized) {
                if (guy === player.id) {
                    await message.channel.send("You cannot eat yourself!")
                    break
                }

                let cupid = db.get(`player_${player.id}`).cupid

                if (db.get(`player_${cupid}`)?.target.includes(guy)) {
                    await message.channel.send("You cannot eat your own couple!")
                    break
                }
            }

            target.push(guy)
        }

        if (target.length !== args.length) return

        await message.channel.send(`${getEmoji("eat", client)} You have decided to eat **${target.map((p) => `${players.indexOf(p) + 1} ${db.get(`player_${p}`).username}`).join("**, **")}**!`)

        db.set(`player_${player.id}.target`, target)
    },
}
