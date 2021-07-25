const db = require("quick.db")
const config = require("../../config")

module.exports = {
    name: "exclude",
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        args.forEach((arg) => {
            args[args.indexOf(arg)] = arg.toLowerCase()
        })

        let roles = config.roles.map((x) => x.name.toLowerCase())
        let aliases = require('../../config/src/aliases')

        let rolestoexclude = []

        for (const key in aliases) {
            if(args.includes(key)) {
                if (Object.hasOwnProperty.call(aliases, key)) {
                    const element = aliases[key];
                    rolestoexclude.push(element)
                    let index = args.indexOf(key)
                    args.splice(index, 1)
                }
            }
        }

        for (let arg of args) {
            arg = arg.toLowerCase().replace("-", " ")
            if (!roles.includes(arg)) return message.channel.send(`Role \`${arg}\` not found!`)
            rolestoexclude.push(arg)
        }

        console.log(rolestoexclude)
        db.set("excludes", rolestoexclude)

        message.channel.send("Done! Excluded those roles!")
    },
}
