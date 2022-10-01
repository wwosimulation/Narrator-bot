const db = require("quick.db")
const { getEmoji } = require("../../../../config")

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const flaggers = players.filter((p) => db.get(`player_${p}`).role === "Flagger" && db.get(`player_${p}`).status === "Alive") // get the alive Flaggers  array - Array<Snowflake>

    for (const fg of flaggers) {
        let flag = db.get(`player_${fg}`)

        if (!flag) continue // skip if the player doesn't exist
        if (!flag.target) continue // skip if the player doesn't have a target
        if (!flag.redirect) continue // skip if the player did not redirect

        let evilRoles = ["Serial Killer", "Cannibal", "Bandit", "Corruptor", "Evil Detective"]
        let allTargets = []

        let { countVotes } = require("../killingActions/wolves.js")
        let result = countVotes(players)
        allTargets.push(result)

        for (const p of players) {
            let player = db.get(`player_${p}`)
            if (evilRoles.includes(player.role) && player.status === "Alive") {
                if (!Array.isArray(player.target)) allTargets.push(player.target)
                else if (Array.isArray(player.target)) allTargets.push(...player.target)
            }
        }

        if (allTargets.includes(flag.target)) {
            let channel = guild.channels.cache.get(flag.channel)
            db.subtract(`player_${fg}.uses`, 1)
            await dayChat.send(`${getEmoji("flagger_kill", client)} The Flagger has redirected an attack!`)
            await channel.send(`${getEmoji("flagger_protect", client)} You have succesfully redirected an attack!`)
            await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
        }

        for (const p of players) {
            let player = db.get(`player_${p}`)
            if (evilRoles.includes(player.role) && player.status === "Alive") {
                if (player.target === flag.target || player.target.includes(flag.target)) {
                    if (!Array.isArray(player.target)) db.set(`player_${player.id}.target`, flag.redirect)
                    else if (Array.isArray(player.target)) {
                        let targets = player.target
                        targets.splice(targets.indexOf(flag.target), 1, flag.redirect)
                        db.set(`player_${player.id}.target`, targets)
                    }
                }
            }
        }

        if (result === flag.target) {
            for (const p of players) {
                let player = db.get(`player_${p}`)
                if (p.status === "Alive" && p.team === "Werewolf" && p.role !== "Werewolf Fan") {
                    db.set(`player_${p}.vote`, flag.target)
                }
            }
        }
    }
}
