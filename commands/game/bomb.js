const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "bomb",
    description: "Place your bombs as bomber.",
    usage: `${process.env.PREFIX}bomb`,
    aliases: ["explode"],
    gameOnly: true,
    run: async (message, args, client) => {
        const setup = [
            ["1", "2", "3", "4"],
            ["5", "6", "7", "8"],
            ["9", "10", "11", "12"],
            ["13", "14", "15", "16"],
        ]

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []

        async function send(msg) {
            await message.channel.send(msg)
        }

        function createPlayerRow(row, players) {
            let arr = []
            let onlyPlayers = players.slice(4 * (row - 1), 4 * row)
            let currentTargets = db.get(`player_${player.id}.target`) || []
            onlyPlayers.forEach((p, index) => {
                let status = db.get(`player_${p}`).status
                let inTarget = currentTargets.includes(p)
                arr.push({ custom_id: `bomb${setup[row - 1][index]}`, type: 2, style: inTarget === true ? 3 : status === "Alive" ? 1 : 4, label: `Player ${setup[row - 1][index]}` })
            })
            return arr
        }

        function createPlayerComponents(players) {
            let ps = Math.ceil(players.length / 4)
            let arr = []
            for (let i = 0; i < ps; i++) {
                arr.push({ type: 1, components: createPlayerRow(i + 1, players) })
            }
            arr.push({ type: 1, components: [{ type: 2, label: "Cancel", style: 4, custom_id: "cancelbomb" }] })
            return arr
        }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        let player = db.get(`player_${message.author.id}`) || { status: "Dead" } // get the player object
        let night = Math.floor(gamePhase / 3) + 1

        // make some checks first
        if (![player.role, player.dreamRole].includes("Bomber")) return
        if (player.status !== "Alive") return await send("Listen to me, you need to be ALIVE to bomb players.")
        if (gamePhase % 3 !== 0) return await send("Placing bombs in broad day light is good. You should do it often!")
        if (player.dreamRole === "Bomber") player = db.get(`player_${player.target}`)
        if (db.get(`game.peace`) === Math.floor(gamePhase / 3) + 1) return await send("This is a peaceful night! You cannot bomb anyone!")
        if (player.jailed) return await send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.lastPlaced === night - 1) return await send("I know you are eager but you just placed your bombs last night. Wait for them to explode!")

        // get the arguments and map them to player ids
        let msg = await message.channel.send({ content: "Place your bombs!", components: createPlayerComponents(players) })

        async function collectButton(msg) {
            msg.awaitMessageComponent({ filter: (i) => i.user.id === message.author.id, time: 30000 })
                .then(async (i) => {
                    night = Math.floor(gamePhase / 3) + 1
                    if (gamePhase % 3 !== 0) return i.update({ content: "Place your bombs!", components: [] })
                    if (i.customId === "cancelbomb") {
                        i.update({ content: "Place your bombs!", components: createPlayerComponents(players) })
                        db.delete(`player_${i.user.id}.target`)
                        return
                    }
                    let row = Math.ceil(Number(i.customId.slice(4)) / 4)
                    let column = setup[row - 1].indexOf(i.customId.slice(4)) + 1
                    console.log(`Row: ${row}\nColumn: ${column}`)
                    console
                    let newComponents = createPlayerComponents(players)

                    // if the bombs are horizontal
                    if ([msg.components[row - 1]?.components[column - 2]?.style, msg.components[row - 1]?.components[column]?.style].includes("SUCCESS")) {
                        if (newComponents[row - 1] && newComponents[row - 1].components[column - 1]) newComponents[row - 1].components[column - 1].style = 3
                        if (newComponents[row] && newComponents[row].components[column]) newComponents[row].components[column].style = 3
                        if (newComponents[row - 2] && newComponents[row - 2].components[column - 2]) newComponents[row - 2].components[column - 2].style = 3
                    }

                    // if the bombs are diagonal from left to right, up to down
                    else if ([msg.components[row]?.components[column]?.style, msg.components[row - 2]?.components[column - 2]?.style].includes("SUCCESS")) {
                        if (newComponents[row - 1] && newComponents[row - 1].components[column - 1]) newComponents[row - 1].components[column - 1].style = 3
                        if (newComponents[row] && newComponents[row].components[column - 1]) newComponents[row].components[column - 1].style = 3
                        if (newComponents[row - 2] && newComponents[row - 2].components[column - 1]) newComponents[row - 2].components[column - 1].style = 3
                    }

                    // if the bombs are vertical
                    else if ([msg.components[row - 2]?.components[column - 1]?.style, msg.components[row]?.components[column - 1]?.style].includes("SUCCESS")) {
                        if (newComponents[row - 1] && newComponents[row - 1].components[column - 1]) newComponents[row - 1].components[column - 1].style = 3
                        if (newComponents[row] && newComponents[row].components[column - 2]) newComponents[row].components[column - 2].style = 3
                        if (newComponents[row - 2] && newComponents[row - 2].components[column]) newComponents[row - 2].components[column].style = 3
                    }

                    // if the bombs are not placed or are diagonal from left to right, down to up
                    else {
                        if (newComponents[row - 1] && newComponents[row - 1].components[column - 1]) newComponents[row - 1].components[column - 1].style = 3
                        if (newComponents[row - 1] && newComponents[row - 1].components[column]) newComponents[row - 1].components[column].style = 3
                        if (newComponents[row - 1] && newComponents[row - 1].components[column - 2]) newComponents[row - 1].components[column - 2].style = 3
                    }

                    await i.update({ content: "Place your bombs!", components: newComponents })

                    // set the targets
                    let target = [...newComponents.filter((a) => a.components.map((b) => b.style.toString()).includes("3")).map((a) => a.components.filter((b) => b.style.toString() === "3").map((b) => b.custom_id.slice(4)))]
                    console.log(target)
                    target = target
                        .join(",")
                        .split(",")
                        .map((v) => players[Number(v) - 1])
                        .filter((p) => p !== message.author.id)
                    console.log(target)
                    db.set(`player_${i.user.id}.target`, target)
                    db.set(`player_${i.user.id}.lastPlaced`, Math.floor(gamePhase / 3) + 1)
                    let gamemessage = target.filter((v) => i.user.id !== v).map((c) => `**${players.indexOf(c) + 1} ${db.get(`player_${c}`).username}**`)
                    i.followUp(`${getEmoji("explode", client)} You have placed bombs on ${gamemessage.join(", ")}!`)
                    collectButton(msg)
                })
                .catch((e) => {
                    msg.edit({ content: msg.content, components: [] })
                })
        }

        collectButton(msg)
    },
}
