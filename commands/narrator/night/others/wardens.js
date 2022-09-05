const db = require("quick.db")
const { getEmoji } = require("../../../../config")

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const wardenChat = guild.channels.cache.find((c) => c.name === "warden-jail")
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const wardens = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Warden") // get the alive wardens array - Array<Snowflake>

    const strongWolves = {
        Werewolf: 1,
        "Junior Werewolf": 2,
        "Split Wolf": 2,
        "Kitten Wolf": 2,
        "Wolf Shaman": 3,
        "Nightmare Werewolf": 3,
        "Voodoo Werewolf": 3,
        "Wolf Trickster": 3,
        "Wolf Pacifist": 4,
        "Guardian Wolf": 4,
        "Shadow Wolf": 5,
        "Werewolf Berserk": 5,
        "Alpha Werewolf": 6,
        "Stubborn Werewolf": 6,
        "Wolf Seer": 7,
        "Lone Wolf": 8,
    } // list the wolves from weakest to strongest


    // loop through each warden
    for (let warden of wardens) {
        let jail = db.get(`player_${warden}`) // get the warden object - Object

        // check if the warden is alive
        if (jail.status !== "Alive") continue;

        // check if the warden has selected the target
        if (!jail.target || jail.target.length < 2) continue;

        let wardenChannel = guild.channels.cache.get(jail.channel)

        if (jail.target.map(p => db.get(`player_${p}`).status).includes("Dead")) {
            await wardenChannel.send(`${getEmoji("warden_jail")} One of your players that you selected was not alive so you could not jail anyone!`)
            continue;
        }

        jail.target.forEach(target => {
            let guy = db.get(`player_${target}`)
            let channel = guild.channels.cache.get(player.channel)
            
            await channel.permissionOverwrites.edit(guy.id, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true
            })

            await wardenChat.permissionOverwrites.edit(guy.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true
            })

            await channel.send(`${getEmoji("warden_jail", client)} You have been jailed by the warden! Head to <#${wardenChat.id}> to talk with the other prisoner! You can't do your actions for tonight. The warden can hear anything you say.`)
            
            if (player.team === "Werewolf" && player.role !== "Werewolf Fan") {
                await werewolvesChat.send(`${getEmoji("warden_jail", client)} Player **${players.indexOf(guy.id)+1} ${guy.username} (${getEmoji(guy.role.toLowerCase().replace(/\s/g, "_"), client)} ${guy.role})** has been jailed by the Warden!`)
            }
        })

        if (jail.target.filter(p => db.get(`player_${p}`).team === "Werewolf" && db.get(`player_${p}`).role !== "Werewolf Fan")) {
            let mappedWolf = alivePlayersBefore.filter((a) => db.get(`player_${a}`).role?.toLowerCase().includes("wolf") && db.get(`player_${a}`).role !== "Werewolf Fan" && jail.target.includes(a)).map((a) => [a, db.get(`player_${a}`).role]) // fillter the wolves and check if there are any
            let sortedWolves = mappedWolf.length === 1 ? mappedWolf : mappedWolf.sort((a, b) => strongWolves[a[1]] - strongWolves[b[1]]) // sort the wolves from weakest to strongest
            let weakestWolf = mappedWolf.filter((w) => strongWolves[w[1]] === strongWolves[sortedWolves[0][1]]) // get all players with the same wolf rank
            let attacker = db.get(`player_${weakestWolf[Math.floor(Math.random() * weakestWolf.length)][0]}`) // get the attacker object
            await wardenChat.send({ content: `${getEmoji("warden_jail_ww", client)} The warden has jailed two werewolves! You can either act out as villagers, or press the button below to kill the warden and break out of jail.`, components: [{ type: 1, components: [{ type: 2, style: 4, label: "Break out", custom_id: `warden-breakout-${attacker.id}` }] }] })
        }

        


    }
}
