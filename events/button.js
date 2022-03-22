const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const ms = require("ms")
const db = require("quick.db")
const { shop, ids, getEmoji } = require("../config")
const { lottery, players } = require("../db")

// Custom id "cancel" and "suicide" are used in "../commands/game/suicide.js"

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isMessageComponent() && interaction.componentType !== "BUTTON") return
        console.log(interaction.customId)
        if (interaction.customId == "igjoin") {
            //if (db.get("started") == "yes") return interaction.reply(`The game has already started!`, { ephemeral: true })
            let guy = interaction.member
            if (guy.roles.cache.has(ids.spectator)) guy.roles.remove(ids.spectator) //spec
            if (guy.roles.cache.has(ids.narrator)) guy.roles.remove(ids.narrator) //narr
            if (guy.roles.cache.has(ids.mini)) guy.roles.remove(ids.mini) //mininarr
            if (guy.roles.cache.has(ids.jowov)) guy.roles.remove(ids.jowov) //jowov
            let role = interaction.guild.roles.cache.get(ids.alive)
            await guy.roles
                .add(ids.alive)
                .then((g) => g.setNickname(role.members.size.toString()).catch((e) => interaction.reply(`Error: ${e.message}`)))
                .catch((e) => interaction.reply(`Error: ${e.message}`))
            await interaction.guild.channels.cache.find((x) => x.name == "game-lobby").send(`${interaction.member.user.tag} joined the game!`)
            interaction.deferUpdate()
        }
        if (interaction.customId == "igspec") {
            let guy = interaction.member
            if (guy.roles.cache.has(ids.dead)) return interaction.reply({ content: `Sorry, you're dead! You can't spectate after you've already played!`, ephemeral: true })
            if (!guy.roles.cache.has(ids.immunity)) {
                guy.setNickname("lazy spectatorz")
            } else {
                guy.setNickname(guy.user.username)
            }
            guy.roles.add(ids.spectator)
            if (guy.roles.cache.has(ids.alive)) guy.roles.remove(ids.alive) //alive
            if (guy.roles.cache.has(ids.narrator)) guy.roles.remove(ids.narrator) //narr
            if (guy.roles.cache.has(ids.mini)) guy.roles.remove(ids.mini) //mininarr
            interaction.deferUpdate()
            await interaction.guild.channels.cache.find((x) => x.name == "game-lobby").send(`${interaction.member.user.tag} is now spectating the game!`)
        }
        if (interaction.customId == "ashish-ignarr") {
            let guild = client.guilds.cache.get(ids.server.sim)
            let member = await guild.members.fetch({ user: interaction.member.id, force: true }).catch((e) => e)
            if (!member.id) return interaction.reply({ content: "You aren't a narrator!", ephemeral: true })
            if (!member.roles.cache.has(ids.minisim) && !member.roles.cache.has(ids.narratorsim) && !member.roles.cache.has(ids.supervisor)) return interaction.reply({ content: "You aren't a narrator!", ephemeral: true })
            if (member.roles.cache.has(ids.minisim)) {
                if (interaction.member.roles.cache.has(ids.mini)) return interaction.reply({ content: "You already have this role!", ephemeral: true })
                if (db.get(`hoster`) != interaction.member.id && db.get(`game`)) return interaction.reply({ content: "Unfortunately, you aren't the host, and because you're a narrator in training, you aren't allowed to narrate spectate!", ephemeral: true })
                interaction.member.roles.add(ids.mini)
            }
            if (member.roles.cache.has(ids.narratorsim)) {
                if (interaction.member.roles.cache.has(ids.narrator)) return interaction.reply({ content: "You already have this role!", ephemeral: true })
                interaction.member.roles.add(ids.narrator)
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
                    let canHost = new MessageButton().setLabel("I can host").setStyle("SUCCESS").setCustomId(`hostrequest-yes;`)
                    let canNotHost = new MessageButton().setLabel("No one can host").setStyle("DANGER").setCustomId(`hostrequest-no;`)
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
                    foundUser.send({ content: `Hey there, we received your request for a game! Unfortunately, no one is able to host a game right now.` }).catch((e) => {
                        interaction.channel.send({ content: "Uhh, I had a problem DMing them. Most probably they have their DM's turned off." })
                    })
                    interaction.reply({ content: `No one can host, so the user has been informed. Thank you ${interaction.member}` })
                    break
                case "yes":
                    foundUser.send({ content: `Hey there, we received your request for a game, so ${interaction.user.tag} is starting one soon!.` }).catch((e) => {
                        interaction.channel.send({ content: "Uhh, I had a problem DMing them. Most probably they have their DM's turned off." })
                    })
                    interaction.reply({ content: `${interaction.user} is now hosting a game! The user has been informed.` })
                    break
                default:
                    break
            }
        }
        if (interaction.customId.startsWith("trick")) {
            let channelID = interaction.customId.split("_")[1]
            interaction.reply(`You have decided to trick`)
            button1 = interaction.message.components[0].components[0]
            button2 = interaction.message.components[0].components[1]
            button1.disabled = true
            button2.disabled = true
            interaction.message.edit({ components: [new MessageActionRow().addComponents(button1, button2)] })
            db.set(`choice_${channelID}`, "trick")
        }
        if (interaction.customId.startsWith("treat")) {
            let channelID = interaction.customId.split("_")[1]
            interaction.reply(`You have decided to treat`)
            button1 = interaction.message.components[0].components[0]
            button2 = interaction.message.components[0].components[1]
            button1.disabled = true
            button2.disabled = true
            interaction.message.edit({ components: [new MessageActionRow().addComponents(button1, button2)] })
            db.set(`choice_${channelID}`, "treat")
        }
        if (interaction.customId == "joinlottery") {
            let player = await players.findOne({ user: interaction.user.id })
            let lot = await lottery.find()
            lot = lot[0]
            let lotsBought = lot.participants.find((u) => Object.keys(u) == interaction.user.id)
            lotsBought ? (lotsBought = Object.values(lotsBought)) : (lotsBought = 0)
            let row1 = new MessageActionRow()
            let row2 = new MessageActionRow()
            let row3 = new MessageActionRow()
            let row4 = new MessageActionRow()
            for (let i = 1; i <= 9; i++) {
                let button = new MessageButton().setStyle("SECONDARY").setLabel(`${i}`).setCustomId(`${i}`)
                if (i <= 3) {
                    row1.addComponents(button)
                } else if (i <= 6) {
                    row2.addComponents(button)
                } else {
                    row3.addComponents(button)
                }
            }
            let no = new MessageButton().setStyle("DANGER").setEmoji("606610883170271236").setCustomId(`no`)
            let zero = new MessageButton().setStyle("SECONDARY").setLabel(`0`).setCustomId(`0`)
            let yes = new MessageButton().setStyle("SUCCESS").setEmoji(`606770420687044618`).setCustomId(`yes`)
            row4.addComponents(no, zero, yes)
            let embed = new MessageEmbed().setTitle(`Lottery ticket shop`).setDescription(`Your coins: ${player.coins}\nYour lottery tickets bought: ${lotsBought}\nMax lottery tickets allowed: ${lot.max}`).addFields({ name: "How many lottery tickets do you want to buy?", value: "\u200b" })
            interaction.reply({ embeds: [embed], ephemeral: true, components: [row1, row2, row3, row4] })
        }

        for (let i = 0; i <= 9; i++) {
            if (interaction.customId == `${i}`) {
                interaction.message.embeds[0].fields[0].value += `${i}`
                interaction.update({ embeds: [interaction.message.embeds[0]] })
            }
        }
        if (interaction.customId == `no`) {
            interaction.message.embeds[0].fields[0].value = `\u200b`
            interaction.update({ embeds: [interaction.message.embeds[0]] })
        }
        if (interaction.customId == `yes`) {
            let player = await players.findOne({ user: interaction.user.id })
            let lot = await lottery.find()
            lot = lot[0]
            let tickets = interaction.message.embeds[0].fields[0].value
            tickets = parseFloat(tickets.replace(/^\D+/g, ""))
            let lotsBought = lot.participants.find((u) => Object.keys(u) == interaction.user.id)
            lotsBought ? (lotsBought = Object.values(lotsBought)) : (lotsBought = 0)
            let lotsLeft = lot.max - lotsBought
            console.log(tickets)
            console.log(lotsLeft)
            if (lotsLeft == 0) {
                return interaction.update({ content: `You can not buy more tickets!`, embeds: [], components: [] })
            } else if (lotsLeft < tickets) {
                return interaction.update({ content: `You can only buy ${lotsLeft} more tickets!`, embeds: [], components: [] })
            } else {
                let cost = lot.cost * tickets
                if (cost > player.coins) {
                    await interaction.update({ content: `You don't have enough coins for that amount of lottery tickets!`, embeds: [], components: [] })
                    return
                }
            }
            interaction.update({ content: `You have bought ${tickets} tickets!`, embeds: [], components: [] })
            let guy = lot.participants.find((parti) => Object.keys(parti) == interaction.user.id)
            if (guy) {
                console.log(guy)
                lot.participants.splice(lot.participants.indexOf(guy), 1, { [interaction.user.id]: parseInt(Object.values(guy)) + parseInt(tickets) })
            } else {
                lot.participants.push({ [interaction.user.id]: parseInt(tickets) })
            }
            lot.ticketsBought += parseInt(tickets)
            lot.pot += lot.cost * parseInt(tickets)
            let embed = new MessageEmbed().setTitle("New Lottery!").setDescription(`Ticket cost: ${lot.cost} ${getEmoji("coin", client)}\nclick 🎟 to enter!\nEnds in: <t:${Math.floor(lot.endDate / 1000)}:R>\n\nParticipants: ${lot.participants.length}\nTickets bought: ${lot.ticketsBought} \nPot size: ${lot.pot} ${getEmoji("coin", client)}`)
            let msg = await interaction.channel.messages.fetch(lot.msg)
            msg.edit({ embeds: [embed] })
            player.coins -= lot.cost * parseInt(tickets)
            player.save()
            lot.save()
        }

        if (interaction.customId.startsWith("itest")) {
            let gameName = interaction.customId.split("-")[1]
            let guy = interaction.member
            if (guy.roles.cache.has(ids.gamebanned)) return interaction.reply({ content: "You are game banned! You cannot join any games", ephemeral: true })
            if (guy.roles.cache.has(ids.joinTest)) return interaction.reply({ content: "You have already joined the test! Check <#955883046710681660> for the instructions!", ephemeral: true })
            let jl = await interaction.guild.channels.cache.find((x) => x.name == "tests")
            guy.roles.add(ids.joinTest).catch((e) => jl.send(`Error: ${e.message}`))
            interaction.guild.channels.cache.find((x) => x.name == "tests").send(`${guy.user.tag} joins test ${gameName}\nUser ID: ${guy.id}`)
            jl.send(`<@${guy.id}>, follow the instructions above to join the test!`).then((m) =>
                setTimeout(() => {
                    m.delete()
                }, 5000)
            )
            let embed = interaction.message.embeds[0]
            embed.description += `\n${guy.user.tag}`
            interaction.update({ embeds: [embed] })
        }
    })
}
