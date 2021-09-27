const { MessageActionRow } = require("discord.js")
const { MessageButton } = require("discord.js")
const ms = require("ms")
const db = require("quick.db")
const { shop } = require("../config")

const canHost = new MessageButton().setLabel("I can host").setStyle("SUCCESS").setCustomId(`hostrequest-yes;`)
const canNotHost = new MessageButton().setLabel("No one can host").setStyle("DANGER").setCustomId(`hostrequest-no;`)

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isMessageComponent() && interaction.componentType !== "BUTTON") return
        console.log(interaction.customId)
        if (interaction.customId == "igjoin") {
            //if (db.get("started") == "yes") return interaction.reply(`The game has already started!`, { ephemeral: true })
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
        if (interaction.customId == "igspec") {
            let guy = interaction.member
            if (guy.roles.cache.has("606131202814115882")) return interaction.reply({ content: `Sorry, you're dead! You can't spectate after you've already played!`, ephemeral: true })
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
        if (interaction.customId == "ashish-ignarr") {
            let guild = client.guilds.cache.get("465795320526274561")
            let member = await guild.members.fetch({ user: interaction.member.id, force: true }).catch((e) => e)
            if (!member.id) return interaction.reply({ content: "You aren't a narrator!", ephemeral: true })
            let mininarr = guild.roles.cache.get("606123620732895232")
            let narrator = guild.roles.cache.get("606123619999023114")
            let supervisor = guild.roles.cache.get("762061739848106024")
            if (!member.roles.cache.has(mininarr.id) && !member.roles.cache.has(narrator.id) && !member.roles.cache.has(supervisor.id)) return interaction.reply({ content: "You aren't a narrator!", ephemeral: true })
            if (member.roles.cache.has(mininarr.id)) {
                if (interaction.member.roles.cache.has("606276949689499648")) return interaction.reply({ content: "You already have this role!", ephemeral: true })
                if (db.get(`hoster`) != interaction.member.id && db.get(`game`)) return interaction.reply({ content: "Unfortunately, you aren't the host, and because you're a narrator in training, you aren't allowed to narrate spectate!", ephemeral: true })
                interaction.member.roles.add("606276949689499648")
            }
            if (member.roles.cache.has(narrator.id)) {
                if (interaction.member.roles.cache.has("606139219395608603")) return interaction.reply({ content: "You already have this role!", ephemeral: true })
                interaction.member.roles.add("606139219395608603")
            }
            interaction.deferUpdate()
        }
        if (interaction.customId.startsWith("gwjoin")) {
            let gameName = interaction.customId.split("-")[1]
            let guy = interaction.member
            if (guy.roles.cache.has("606123628693684245")) return interaction.reply({ content: "You are game banned! You cannot join any games", ephemeral: true })
            if (guy.roles.cache.has("606123676668133428")) return interaction.reply({ content: "You have already joined the game! Check <#606123823074377740> for the link!", ephemeral: true })
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

        if (interaction.customId.startsWith("shoppage")) {
            let page = parseInt(interaction.customId.split("-")[1])
            interaction.update({
                embeds: [shop.embeds[page - 1]],
            })
        }

        if (interaction.customId.startsWith("gp")) {
            let cmd = interaction.customId.split("-")[1]
            switch (cmd) {
                case "request":
                    let nextTime = db.get("nextRequest")
                    if (nextTime && nextTime > Date.now()) return interaction.reply({ content: `A game can only be requested once per every 30 minutes! The next game can be requested <t:${Math.round(nextTime / 1000)}:R>`, ephemeral: true })
                    canHost.customId += interaction.member.id
                    canNotHost.customId += interaction.member.id
                    const row = new MessageActionRow().addComponents(canHost, canNotHost)
                    client.channels.cache.get("606123759514025985").send({ content: `${interaction.member} is requesting a game! ||@here||\n\nThe below buttons will send a DM to the requesting user about your choice.`, components: [row] })
                    interaction.reply({ content: "Your request has been sent to the narrators!", ephemeral: true })
                    db.set("nextRequest", Date.now() + ms("30m"))
                    break
                case "stats":
                    interaction.reply({ content: `The last winner of the game was ${db.get("winner")}. More accurate/useful stats are coming soon!`, ephemeral: true })

                default:
                    break
            }
        }
        //hostrequest-no;1920765935063
        if (interaction.customId.startsWith("hostrequest")) {
            let cmd = interaction.customId.split("-")[1]
            let [action, user] = cmd.split(";")
            foundUser = interaction.guild.members.resolve(user)
            switch (action) {
                case "no":
                    foundUser.send({ content: `Hey there, we received your request for a game! Unfortunately, no one is able to host a game right now.` })
                    interaction.reply(`No one can host, so the user has been informed. Thank you ${interaction.member}`)
                    break
                case "yes":
                    foundUser.send({ content: `Hey there, we received your request for a game, so ${interaction.member} is starting one soon!.` })
                    interaction.reply(`${interaction.member} is now hosting a game! The user has been informed.`)
                    break
                default:
                    break
            }
        }
        if (interaction.customId.startsWith("trick")) {
            let channelID = interaction.customId.split("_")
            console.log("e")
            client.channels.cache.get(channelID).send(`You have decided to trick`)
            interaction.components[0].setDisabled(true)
        }
    })
}
