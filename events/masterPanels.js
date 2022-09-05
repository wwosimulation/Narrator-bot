const db = require("quick.db")
const ms = require("ms")

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.customId === "dev-restart") {
            let restart = await interaction.reply({ content: "Restarting...", fetchReply: true })
            db.set("botRestart", restart.channelId + "/" + restart.id)
            client.destroy()
            require("child_process").execSync("npm run start", { stdio: "inherit" });
        }

        if (interaction.customId == "dev-emergencystop") {
            await interaction.reply({ content: "Emergency stop initiated by " + interaction.user.tag })
            db.set("emergencystop", true)
            process.exit(0)
        }
        if (interaction.customId == "dev-status") {
            let embed1 = {
                title: "Verion Info",
                fields: [
                    { name: "Version", value: require(process.cwd() + "/package.json").version, inline: true },
                    { name: "Branch", value: require("child_process").execSync("git rev-parse --abbrev-ref HEAD").toString().trim(), inline: true },
                    { name: "Commit", value: require("child_process").execSync("git rev-parse --short HEAD").toString().trim(), inline: true },
                    { name: "Commit Message", value: require("child_process").execSync("git log -1 --pretty=%B").toString().trim(), inline: true },
                    { name: "Uptime", value: `${ms(client.uptime)}`, inline: true },
                    { name: "Files", value: `Loaded ${Object.keys(require.cache).length} files in total`, inline: true },
                ],
                color: 0x5865F2,
            }
            // get and sort all game variables
            let vars = db.all()
            let e1 = { title: "Game Variables", description: "", color: 0x1fff43 }
            let e2 = { title: "Game Variables", description: "", color: 0x1fff43 }
            let e3 = { title: "Game Variables", description: "", color: 0x1fff43 }
            let e = []
            vars.forEach(v => {
                let e_1 = ["gamewarnIndex", "entermsg", "nextRequest", "hoster", "gamePhase", "gameCode", "wwsVote", "started", "winner", "xpGiven", "xpExclude", "stafflist", "stafflist2", "stafflist3", "commandEnabled"]
                if(e_1.includes(v.ID)) {
                    e1.description += `**${v.ID}:** \`${v.data}\`\n`
                } else if (v.ID.includes("votemsgid_")) {
                    e2.description += `**${v.ID}:** \`${v.data}\`\n`
                } else if(["skipVotes", "players"].includes(v.ID)) {
                    e3.description += `**${v.ID}:** \`${v.data.toString() + " - " + v.data.length}\`\n`
                } else if (v.ID.includes("player_")) {
                    e.push(require("util").inspect(v.data))
                }
            })

            let embeds = []
            embeds.push(embed1)

            if(e1.description != "") embeds.push(e1)
            if(e2.description != "") embeds.push(e2)
            if(e3.description != "") embeds.push(e3)

            e.forEach(er => { 
                embeds.push({ title: "Player Data", description: "```js\n" + er + "```", color: 0x1fff43 })
            })

            let r = await interaction.reply({ embeds: [embeds[0]], fetchReply: true })
            client.buttonPaginator(interaction.user.id, r, embeds, 1)

        }
    })
}
