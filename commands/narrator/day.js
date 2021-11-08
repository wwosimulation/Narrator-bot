const db = require("quick.db")
const shuffle = require("shuffle-array")
const { getRole, getEmoji } = require("../../config")

module.exports = {
    name: "day",
    description: "Day! :D",
    usage: `${process.env.PREFIX}day [wolf_kill]`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        
    }
}

// function to check bodyguard protection
const checkBg = (player) => {
    for (let b = 0; b < bg.length; b++) {
        let chan = message.guild.channels.cache.get(bg[b])
        let lives = db.get(`lives_${chan.id}`)
        let guard = db.get(`guard_${chan.id}`)
        if (guard == player.nickname) {
            if (lives == 2) {
                toDelude = "0"
                chan.send(`${getEmoji("guard", client)} You fought off an attack last night and survived. Next time you are attacked you will die.`)
                chan.send(`${alive}`)
                illusionist.send(`${getEmoji("guard", client)} Player **${disguise.nickname} ${disguise.user.username}** could not be disguised!`)
                illusionist.send(`${alive}`)
                db.subtract(`lives_${chan.id}`, 1)
            }
        }
    }
}
