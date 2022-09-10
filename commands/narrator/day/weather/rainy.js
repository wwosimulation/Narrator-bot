const db = require("quick.db")
const shuffle = require("shuffle-array")
const { getEmoji } = require("../../../../config")

module.exports = async (message, client) => {

    const players = db.get(`players`)
    const dayChat = message.guild.channels.cache.find(c => c.name === "day-chat")
    
    setTimeout(async () => {

        const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive")
        if (alivePlayers.length <= 1) return;
        
        shuffle(alivePlayers)

        let randomPlayer = db.get(`player_${alivePlayers[0]}`)
        let member = await message.guild.members.fetch(alivePlayers[0])
        await dayChat.send(`🌧️ The rain washed the disguise of player **${players.indexOf(randomPlayer.id)+1} ${randomPlayer.username} (${getEmoji(randomPlayer.role.toLowerCase().replace(/\s/g, "_"), client)} ${randomPlayer.role})**.`)
        await member.roles.add("892046205780131891")
    }, 25000)

}