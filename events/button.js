const db = require("quick.db")
const { shop } = require("../config")
module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isMessageComponent() && interaction.componentType !== "BUTTON") return
        console.log(interaction.customID)
        if (interaction.customID == "igjoin") {
            if (db.get("started") == "yes") return interaction.reply(`The game has already started!`, { ephemeral: true })
            let guy = interaction.member
            if (guy.roles.cache.has("606140764682190849")) guy.roles.remove("606140764682190849") //spec
            if (guy.roles.cache.has("606276949689499648")) guy.roles.remove("606276949689499648") //narr
            if (guy.roles.cache.has("606139219395608603")) guy.roles.remove("606139219395608603") //mininarr
            let role = interaction.guild.roles.cache.get("606140092213624859")
            await guy.roles
                .add("606140092213624859")
                .then((g) => g.setNickname(role.members.size.toString()).catch((e) => message.channel.send(`Error: ${e.message}`)))
                .catch((e) => message.channel.send(`Error: ${e.message}`))
            await interaction.guild.channels.cache.get("606132387587293195").send(`${interaction.member.user.tag} joined the game!`)
            interaction.deferUpdate()
        }
        if (interaction.customID == "igspec") {
            let guy = interaction.member
            if (guy.roles.cache.has("606131202814115882")) return interaction.reply(`Sorry, you're dead! You can't spectate after you've already played!`, { ephremal: true })
            if (!guy.roles.cache.has("691298564508352563")) {
                guy.setNickname("lazy spectatorz")
            } else {
                guy.setNickname(guy.user.username)
            }
            guy.roles.add("606140764682190849")
            if (guy.roles.cache.has("606140092213624859")) guy.roles.remove("606140092213624859") //alive
            if (guy.roles.cache.has("606276949689499648")) guy.roles.remove("606276949689499648") //narr
            if (guy.roles.cache.has("606139219395608603")) guy.roles.remove("606139219395608603") //mininarr
            if (guy.roles.cache.has("606138907817672714")) guy.roles.remove("606138907817672714") //yoloofwwo
            interaction.deferUpdate()
            await interaction.guild.channels.cache.get("606132387587293195").send(`${interaction.member.user.tag} is now spectating the game!`)
        }
        if (interaction.customID == "ashish-ignarr") {
            let guild = client.guilds.cache.get("465795320526274561")
            let member = await guild.members.fetch({ user: interaction.member.id, force: true }).catch((e) => e)
            if (!member.id) return interaction.reply("You aren't a narrator! Error: 404 Not found", { ephemeral: true })
            let mininarr = guild.roles.cache.get("606123620732895232")
            let narrator = guild.roles.cache.get("606123619999023114")
            if (!member.roles.cache.has(mininarr.id) && !member.roles.cache.has(narrator.id)) return interaction.reply("You aren't a narrator! Error: 500 Access blocked", { ephemeral: true })
            if (member.roles.cache.has(mininarr.id)) {
                if (interaction.member.roles.cache.has("606276949689499648")) return interaction.reply("You already have this role!", { ephemeral: true })
                if (db.get(`game`)) return interaction.reply('A game is already being hosted, and as per the staff rules, minis can\'t "narrate specate"!', { ephemeral: true })
                if (db.get(`hoster`) != interaction.member.id && db.get(`game`)) return interaction.reply("Unfortunately, you aren't the host, and because you're a narrator in traning, you aren't allowed to narrate spectate!", { ephemeral: true })
                interaction.member.roles.add("606276949689499648")
            }
            if (member.roles.cache.has(narrator.id)) {
                if (interaction.member.roles.cache.has("606139219395608603")) return interaction.reply("You already have this role!", { ephemeral: true })
                interaction.member.roles.add("606139219395608603")
            }
            interaction.deferUpdate()
        }
        if (interaction.customID.startsWith("gwjoin")) {
            let gameName = interaction.customID.split("-")[1]
            let guy = interaction.member
            if (guy.roles.cache.has("606123628693684245")) return interaction.reply("You are game banned! You cannot join any games", { ephemeral: true })
            if (guy.roles.cache.has("606123676668133428")) return interaction.reply("You have already joined the game! Check <#606123823074377740> for the link!", { ephemeral: true })
            guy.roles.add("606123676668133428").catch((e) => interaction.guild.channels.cache.get("606123821656702987").send(`Error: ${e.message}`))
            interaction.guild.channels.cache.find((x) => x.name == "joined").send(`${guy.user.tag} joins match ${gameName}\nUser ID: ${guy.id}`)
            let jl = await interaction.guild.channels.cache.find((x) => x.name == "joined-link")
            jl.send(`<@${guy.id}>, use the link above to join the game!`).then((m) =>
                setTimeout(() => {
                    m.delete()
                }, 5000)
            )
            let embed = interaction.message.embeds[0]
            embed.description += `\n${guy.user.tag}`
            interaction.update({ embeds: [embed] })
        }

        if (interaction.customID.startsWith("shoppage")) {
            let page = parseInt(interaction.customID.split("-")[1])
            interaction.update({
                embeds: [shop.embeds[page - 1]],
            })
        }
    })
}
