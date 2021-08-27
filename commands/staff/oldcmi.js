const { fn } = require("../../config")
const db = require("quick.db")

module.exports = {
    name: "oldcmi",
    description: "Check if an user has the old CMI.",
    usage: `${process.env.PREFIX}oldcmi <user>`,
    aliases: [],
    staffOnly: true,
    run: async (message, args) => {
        msg = ``
        args.forEach((x) => {
            let user = fn.getUser(x, message)
            if (user) {
                if (db.get(`oldcmi_${user.id}`)) {
                    msg += `✅ ${user.user.tag} has the old CMI\n`
                } else {
                    msg += `❌ ${user.user.tag} does not have the old CMI\n`
                }
                console.log(user)
            } else {
                msg += `Unable to find the user ${x}\n`
            }
        })
        message.channel.send(msg)
    },
}
