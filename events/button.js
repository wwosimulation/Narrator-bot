const db = require("quick.db")
module.exports = (client) => {
    client.on("interaction", async (interaction) => {
        if (!interaction.isMessageComponent() && interaction.componentType !== "BUTTON") return
        console.log(interaction.customID)
        if (interaction.customID == "igjoin") {
            if (db.get("started") == "yes") return message.guild.channels.cache.get("606132299372822582").send(`${user} Game has started!`)
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
        }
        if (interaction.customID.startsWith("gwjoin")) {
            let gameName = interaction.customID.split("-")[1]
            let guy = interaction.member
            if (guy.roles.cache.has("606123628693684245")) return interaction.reply("You are game banned! You cannot join any games", { ephemeral: true })
            if (guy.roles.cache.has("606123676668133428")) return interaction.reply("You have already joined the game! Check <#606123823074377740> for the link!", { ephemeral: true })
            //guy.roles.add("606123676668133428").catch(e => interaction.guild.channels.cache.get("606123821656702987").send(`Error: ${e.message}`))
            //interaction.guild.channels.cache.find(x => x.name == "joined").send(`${guy.user.tag} joins match ${gameName}\nUser ID: ${guy.id}`)
            let jl = await interaction.guild.channels.cache.find((x) => x.name == "joined-link")
            jl.send(`<@${guy.id}>, use the link above to join the game!`).then((m) => setTimeout(() => {m.delete()}, 5000))
            let embed = interaction.message.embeds[0]
            embed.description += `\n${guy.user.tag}`
            interaction.update({ embeds: [embed] })
        }
    })
}
