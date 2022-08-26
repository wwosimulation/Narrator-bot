const db = require("quick.db")
const ms = require("ms")
const { fn } = require("../../config")

module.exports = {
    name: "vt",
    description: "Start the voting time.",
    usage: `${process.env.PREFIX}vt [time...]`,
    narratorOnly: true,
    gameOnly: true,
    run: async (message, args, client) => {
        const players = db.get(`players`)
        const deadPlayers = players.filter((p) => db.get(`player_${p}`).status === "Dead")
        const seerappprentices = players.filter(p => db.get(`player_${p}`).originalRole === "Seer Apprentice" && db.get(`player_${p}`).status === "Alive")
        let gamephase = db.get(`gamePhase`)
        if (gamephase % 3 != 1) return message.channel.send("Please first use `+day`")
        if(!args[0]) args[0] = db.get("defaultVT") ?? "1m"
        else db.set("defaultVT", args[0])
        let timer = ms(args.join(" "))
        if (!timer) return message.channel.send("Invalid time!")
        let voteChat = message.guild.channels.cache.find((c) => c.name === "vote-chat")
        let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        let aliveRole = message.guild.roles.cache.find((r) => r.name === "Alive")
        db.set(`wwsVote`, "NO")
        db.set(`skipVotes`, [])
        let votes = Math.floor(parseInt(aliveRole.members.size) / 2)
        dayChat.send(`Get ready to vote! (${votes} vote${votes == 1 ? "" : "s"} required)`)
        let droppy = { type: 3, custom_id: "votephase", options: [] }
        droppy.options.push({ label: `Cancel`, value: `votefor-cancel`, description: `Cancel your vote` })
        for (let i = 1; i <= 16; i++) {
            console.log(i)
            let player = message.guild.members.cache.find((x) => x.nickname == `${i}` && x.roles.cache.has(aliveRole.id))
            if (player) {
                droppy.options.push({ label: `${i}`, value: `votefor-${i}`, description: `${player.user.tag}` })
            }
        }
        let row = { type: 1, components: [droppy] }
        let m = await voteChat.send({ content: `Timer set to ${ms(timer)} <@&${aliveRole.id}>`, components: [row] })

        // loop through each dead player
        for (const player of deadPlayers) {
            let guy = db.get(`player_${player}`) // get the player - Object
            if (guy.status === "Alive") continue // if the player is alive, don't do anything and check for the next player

            // revive the player
            if (guy.ritualRevive !== gamephase + 1) return // if the phase isn't over yet, don't do anything and check for the next player

            db.set(`player_${guy.id}.status`, "Alive") // set the status of the player to Alive
            let member = await message.guild.members.fetch(guy.id) // get the discord member
            let memberRoles = member.roles.cache
                .map((r) => (r.name === "Dead" ? ["892046206698680390", "892046205780131891"] : r.id))
                .join(",")
                .split(",") // get the roles, and replace the dead role with alive
            await dayChat.send(`${getEmoji("ritualist_revive", client)} The Ritualist revived **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(guy.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${guy.role})**`) // sends a message in day chat
            await member.roles.set(memberRoles)

            
            for (const seerapp of seerappprentices) {
                if (db.get(`player_${seerapp}`).originalPlayer !== guy.id) continue;

                let allRoles = db.get(`player_${seerapp}.allRoles`)
                allRoles.pop()
                db.set(`player_${seerapp}.allRoles`, allRoles)
                db.delete(`player_${seerapp}.originalRole`)
                db.set(`player_${seerapp}.role`, "Seer Apprentice")

                let channel = guild.channels.cache.get(db.get(`player_${seerapp}`)?.channel)
                channel?.send(`The **${guy.role}** has been revived so you have become a **Seer Apprentice** again.`)
                channel?.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
                channel?.edit({ name: `priv-seer-apprentice` })
            }
        }

        db.set(`commandEnabled`, `yes`)
        db.add(`gamePhase`, 1)
        if(message?.author) message.channel.send(`Setting the vote time for ${ms(timer)}`)
        setTimeout(async () => {
            if (m.editable) await m.edit(fn.disableButtons(m))
            voteChat.send(`Time is up!`)
        }, timer)
    },
}
