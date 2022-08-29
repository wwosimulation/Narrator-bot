const ms = require("ms")
const db = require("quick.db")
const { shop, ids, getEmoji, fn } = require("../config")
const { lottery, players } = require("../db")

// Custom id "cancel" and "flee" are used in "../commands/game/flee.js"

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isMessageComponent() && interaction.componentType !== "BUTTON") return
        console.log(interaction.customId)
        if (interaction.customId == "igjoin") {
            interaction.deferUpdate()
            let guy = interaction.member
            if (guy.roles.cache.has(ids.spectator)) guy.roles.remove(ids.spectator) //spec
            if (guy.roles.cache.has(ids.narrator)) guy.roles.remove(ids.narrator) //narr
            if (guy.roles.cache.has(ids.mini)) guy.roles.remove(ids.mini) //mininarr
            if (guy.roles.cache.has(ids.jowov)) guy.roles.remove(ids.jowov) //jowov
            let role = interaction.guild.roles.cache.get(ids.alive)
            await guy.roles.add(ids.alive).catch((e) => interaction.reply(`Error: ${e.message}`))
            await interaction.guild.channels.cache.find((x) => x.name == "game-lobby").send(`${interaction.member.user.tag} joined the game!`)
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
                    let canHost = { type: 2, style: 3, label: "I can host", custom_id: "hostrequest-yes;" }
                    let canNotHost = { type: 2, style: 4, label: "No one can host", custom_id: "hostrequest-no;" }
                    let nextTime = db.get("nextRequest")
                    if (nextTime && nextTime > Date.now()) return interaction.reply({ content: `A game can only be requested once per every 30 minutes! The next game can be requested <t:${Math.round(nextTime / 1000)}:R>`, ephemeral: true })
                    canHost.custom_id += interaction.member.id
                    canNotHost.custom_id += interaction.member.id
                    const row = { type: 1, components: [canHost, canNotHost] }
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
            let x = fn.disableButtons(interaction.message)
            interaction.message.edit(x)
        }
        if (interaction.customId.startsWith("trick")) {
            let channelID = interaction.customId.split("_")[1]
            interaction.reply(`You have decided to trick`)
            let button1 = interaction.message.components[0].components[0]
            let button2 = interaction.message.components[0].components[1]
            button1.disabled = true
            button2.disabled = true
            interaction.message.edit({ components: [{ type: 1, components: [button1, button2] }] })
            db.set(`choice_${channelID}`, "trick")
        }
        if (interaction.customId.startsWith("treat")) {
            let channelID = interaction.customId.split("_")[1]
            interaction.reply(`You have decided to treat`)
            let button1 = interaction.message.components[0].components[0]
            let button2 = interaction.message.components[0].components[1]
            button1.disabled = true
            button2.disabled = true
            interaction.message.edit({ components: [{ type: 1, components: [button1, button2] }] })
            db.set(`choice_${channelID}`, "treat")
        }
        if (interaction.customId == "joinlottery") {
            let player = await players.findOne({ user: interaction.user.id })
            let lot = await lottery.find()
            lot = lot[0]
            let lotsBought = lot.participants.find((u) => Object.keys(u) == interaction.user.id)
            lotsBought ? (lotsBought = Object.values(lotsBought)) : (lotsBought = 0)
            let row1 = { type: 1, components: [] }
            let row2 = { type: 1, components: [] }
            let row3 = { type: 1, components: [] }
            let row4 = { type: 1, components: [] }
            for (let i = 1; i <= 9; i++) {
                let button = { type: 2, style: 2, label: `${i}`, custom_id: `${i}` }
                if (i <= 3) {
                    row1.components.push(button)
                } else if (i <= 6) {
                    row2.components.push(button)
                } else {
                    row3.components.push(button)
                }
            }
            let no = { type: 2, style: 4, custom_id: `no`, emoji: { id: "606610883170271236" } }
            let zero = { type: 2, style: 2, custom_id: `0`, label: `0` }
            let yes = { type: 2, style: 3, custom_id: `yes`, emoji: { id: "606770420687044618" } }

            row4.components.push(no, zero, yes)

            let embed = { title: `Lottery ticket shop`, description: `Your coins: ${player.coins}\nYour lottery tickets bought: ${lotsBought}\nMax lottery tickets allowed: ${lot.max}`, fields: [{ name: "How many lottery tickets do you want to buy?", value: "\u200b" }] }
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
            let embed = { title: "New Lottery!", description: `Ticket cost: ${lot.cost} ${getEmoji("coin", client)}\nclick 🎟 to enter!\nEnds in: <t:${Math.floor(lot.endDate / 1000)}:R>\n\nParticipants: ${lot.participants.length}\nTickets bought: ${lot.ticketsBought} \nPot size: ${lot.pot} ${getEmoji("coin", client)}` }
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

        if (interaction.customId.startsWith("warden-breakout")) {
            let player = db.get(`player_${interaction.member.id}`)
            if (!player) return interaction.reply({ content: "This button is not for you!", ephemeral: true })
            if (player.team !== "Werewolf" || player.role === "Werewolf Fan") return interaction.reply({ content: "This button is not for you!", ephemeral: true })
            if (player.status !== "Alive") return interaction.reply({ content: "This button is not for you!", ephemeral: true })
            await interaction.deferUpdate()
            let dayChat = interaction.guild.channels.cache.find((c) => c.name === "day-chat")
            let warden = db.get(`players`).find((p) => db.get(`player_${p}`).role === "Warden")
            let member = await interaction.guild.members.fetch(warden)
            db.set(`player_${warden}.status`, "Dead")
            await member.roles.set(member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)))
            await dayChat.send(`${getEmoji("warden_ww_jail", client)} **${db.get(`players`).indexOf(warden) + 1} ${db.get(`player_${warden}`).username} (${getEmoji("warden", client)} Warden)** jailed two werewolves. The werewolves broke out of their prison and killed the warden!`)
            client.emit("playerKilled", db.get(`player_${warden}`), db.get(`player_${player.id}`), { trickster: false })
            await interaction.editReply({ content: "You have killed the warden!", components: [] })
        }

        if (interaction.customId.startsWith("inmatekill-")) {
            let player = db.get(`player_${interaction.member.id}`)
            if (!player) return interaction.reply({ content: "This button is not for you!", ephemeral: true })
            if (player.status !== "Alive") return interaction.reply({ content: "This button is not for you!", ephemeral: true })
            if (player.team !== "Village" && player.role !== "Werewolf Fan") return interaction.reply({ content: "This button is not for you!", ephemeral: true })
            if (db.get(`gamePhase`).toString() !== interaction.customId.split("-")[2]) return interaction.update({ content: "This button is no longer available", components: [] })
            await interaction.deferUpdate()
            let dayChat = interaction.guild.channels.cache.find((c) => c.name === "day-chat")
            let inmate = db.get(`player_${interaction.customId.split("-")[1]}`)
            let result = true
            if (inmate.team === "Village") result = false
            let role = player.role
            if (result === false && player.tricked) role = "Wolf Trickster"
            let gameMessage = result === true ? `The warden gave a weapon to an inmate who used it to kill **${db.get(`players`).indexOf(inmate.id)} ${inmate.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**` : `**${db.get(`players`).indexOf(player.id) + 1} ${player.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** tried to kill **${players.indexOf(inmate.id) + 1} ${inmate.username}** with a weapon from the Warden but the weapon backfired! **${players.indexOf(inmate.id) + 1} ${inmate.username}** is a villager!`
            let member = await interaction.guild.members.fetch(result === true ? inmate.id : player.id)
            db.set(`player_${member.id}.status`, "Dead")
            await member.roles.set(member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)))
            await dayChat.send(`${getEmoji("warden_kill", client)} ${gameMessage}`)
            client.emit("playerKilled", db.get(`player_${member.id}`), db.get(`player_${player.id}`))
            await interaction.editReply({ components: [] })
        }

        if (interaction.customId.startsWith("treat-") || interaction.customId.startsWith("trick-")) {
            let [option, player, attacker] = interaction.customId.split("-")
            if (player !== interaction.member.id) return interaction.reply({ content: "This button is not for you!", ephemeral: true })
            if (!db.get(`player_${player}`)) return interaction.reply({ content: "This button is not for you!", ephemeral: true })
            if (db.get(`player_${player}`).status !== "Alive") return interaction.reply({ content: "You can only use this button when Alive!", ephemeral: true })
            if (db.get(`player_${player}`).trickortreat === true) return interaction.reply({ content: "You already cliecked this button!", ephemeral: true })

            let killOption = db.get(`player_${attacker}`)?.killOption
            if (!killOption) return interaction.reply({ content: "Looks, like the Jack did not set a kill option. Please ping a narrator for assistance!" })
            if (option === killOption) {
                interaction.reply(`${getEmoji("jack_kill", client)} You have chosen the wrong option so you have been killed!`)
                let dayChat = interaction.guild.channels.cache.find((c) => c.name === "day-chat")
                let memberRoles = interaction.member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id))
                let role = db.get(`player_${player}`).role
                if (db.get(`player_${player}`).tricked) role = "Wolf Trickster"
                db.set(`player_${player}.status`, "Dead")
                await interaction.member.roles.set(memberRoles)
                await dayChat.send(`${getEmoji("jack_kill", client)} **${db.get(`players`).indexOf(player) + 1} ${db.get(`player_${player}`).username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** had encoutered a Jack and chose the wrong option that lead them to their death!`)
                client.emit("playerKilled", db.get(`player_${player}`), db.get(`player_${attacker}`))
            } else {
                interaction.reply(`${getEmoji(option, client)} You have chosen the safe option so you evaded the Jack's encounter!`)
            }
            interaction.message?.edit({ components: [] })
        }
    })
}
