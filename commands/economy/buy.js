const { getEmoji } = require("../../config/src")
const pluralize = require("pluralize")
const { players } = require("../../db.js")
const { colors, items } = require("../../config/src/shop")
const { server } = require("../../config/src/ids")
const ids = require("../../config/src/ids")

module.exports = {
    name: "buy",
    description: "Buy an item from the shop.",
    usage: `${process.env.PREFIX}buy <item | <color> (color)>`,
    run: async (message, args, client) => {
        if (!["439223656200273932", "801726595378315264", "263472056753061889", "517335997172809728", "840938038028533782", "719564153072910407", "802145702531825685"].includes(message.author.id)) {
            return message.channel.send("We are currently testing a new buy system. During this time we have some changes as well:\n`buy` - doesn't work. use `+buydep` instead\n`shop` - does not contain the currencies\n`profile` - is back to the original format")
        }

        // functions
        args.forEach((x, i) => {
            args[i] = x.toLowerCase()
        })
        let sim = client.guilds.resolve(server.sim)
        let guy = await players.findOne({ user: message.author.id })
        let failMessage = (l10nCode, toReplace = {}) => {
            return message.channel.send(message.l10n(l10nCode, toReplace))
        }
        let successMsg = ({ l10nCode = null, toReplace = {}, item = null, amount = null, color = null }) => {
            if (l10nCode) return message.channel.send(message.l10n(l10nCode, toReplace))
            else return message.channel.send(`You have successfully purchased ${amount ? amount : "the"} ${color ? `${color.name}` : ""}${pluralize(item.name, amount ? amount : 1)}!\nYou have been charged ${pluralize(pluralize.singular(item.currency), item.price, true)} ${getEmoji(pluralize.singular(item.currency), client)}!${item.response ? `\n${item.response}` : ""}`)
        }
        let appplyRole = (roleID, color = false) => {
            let applied = false
            let guyz = sim.members.cache.find((member) => member.id === message.author.id)
            !guyz ? failMessage("userInvalid", { user: message.author }) : guyz.roles.cache.has(roleID) ? (color === false ? failMessage("alreadyPurchasedRole") : failMessage("alreadyPurchasedColor")) : (guyz.roles.add(roleID), (applied = true))
            return applied
        }
        let hasRole = (roleID) => {
            if (sim.members.cache.find((m) => m.id === message.author.id).roles.cache.has(roleID)) return true
            else return false
        }
        let charge = async ({ item, amount = 1, l10nCode = null, toReplace = {}, color = null }) => {
            if (color && item) item.currency = item.currency + "s"
            if (!item) return failMessage("noItemProvided")
            if (guy[item.currency] < item.price) {
                failMessage("notEnoughCurrency", { currency: item.currency })
                return false
            }
            let update = {}
            update[item.currency] = -item.price * amount
            await guy.updateOne({ $inc: update })
            return successMsg({ l10nCode: l10nCode, toReplace: toReplace, item: item, amount: amount === 1 && !["rose", "bouquet"].includes(item.id) ? 0 : amount, color: color })
        }
        //checking arguments
        if (!args[0]) return failMessage("noItemProvided")
        args.forEach((arg, i) => {
            if (["grey", "private", "game", "rose"].indexOf(arg) === -1) {
                args[i] = arg
            } else {
                let ind = ["grey", "private", "game", "rose"].indexOf(arg)
                args[i] = ["gray", "channel", "gamegifs", "roses"][ind]
            }
        })
        if (["color", "colour"].includes(args[0]) && !args[1]) return message.reply({ content: `Please choose a color from \`${process.env.PREFIX}shop colors\`!\nThe correct usage for this command is \`${process.env.PREFIX}buy color <color>\``, allowedMentions: { repliedUser: false } })

        // Color Roles:
        if (["color", "colour"].includes(args[0]) || ["color", "colour"].includes(args[1])) {
            if (["color", "colour"].includes(args[0])) args.shift()
            for (let color of colors) {
                if (color.name === args[0]) {
                    if (!hasRole(color.id)) if (charge({ item: items.find((i) => i.id === "color"), color: color }) !== false) return appplyRole(color.id, true) === true
                    return
                }
            }
            return failMessage("unknownColor", { color: args[0] ? args[0] : "` ` (Nothing)" })
        } else {
            if (args[0] === "roses" && args[1] && args[1] === "bouquet") args.shift()
            let item = items.find((element) => element.id === args[0])
            if (!item) return failMessage("noItemProvided")
            // Other Roles
            if (item.role) {
                if (!hasRole(item.role)) {
                    if (charge({ item: item }) === false) return
                    appplyRole(item.role)
                } else return failMessage("alreadyPurchasedItem", { item: item.name })
            }
            // Inventory Items
            if (["roses", "bouquet"].includes(item.id)) {
                let obj = {}
                obj[`inventory.${item.id}`] = parseInt(args[2]) || 1
                await guy.updateOne({ $inc: obj })
                return charge({ amount: parseInt(args[2]) || 1, item: item })
            }
            let dbName
            switch (item.id) {
                case "description":
                    dbName = "profileDesc"
                    break
                case "icon":
                    dbName = "profileIcon"
                    break
                case "special":
                    dbName = "customRole"
                    break
                case "channel":
                    dbName = "privateChannel"
                    break
                default:
                    dbName = item.id
                    break
            }
            if (guy[dbName] !== false && guy[dbName] !== "") return failMessage("alreadyPurchasedItem", { item: item.name })
            // Boolean values
            if (["profile", "cmi"].includes(dbName)) {
                let obj = {}
                obj[dbName] = true
                await guy.updateOne({ $set: obj })
                return charge({ item: item })
            }
            // Description + Icon
            if (["description", "icon"].includes(item.id)) {
                args.shift()
                let value = args[0] ? args.join(" ") : item.id === "description" ? `Hey there! I am <@${message.author.id}>` : "https://i.imgur.com/6fL8AD2.png"
                let obj = {}
                obj[dbName] = value
                await guy.updateOne({ $set: obj })
                return charge({ item: item })
            }
            // Custom Role and Channel
            if (["special", "channel"].includes(item.id)) {
                let obj = {}
                // Role
                if (item.id === "special") {
                    let colorRolesStart = sim.roles.cache.get("606247387496972292")
                    sim.roles
                        .create({
                            name: `${message.author.username}'s Special Role`,
                            color: "#007880",
                            position: colorRolesStart.position + 1,
                            reason: message.author.tag + " bought special role item",
                        })
                        .then(async (role) => {
                            appplyRole(role.id)
                            await guy.updateOne({ $set: obj })
                            charge({ item: item })
                            obj[dbName] = role.id
                        })
                }
                if (item.id === "channel") {
                    sim.channels
                        .create(`${message.author.username}-channel`, {
                            type: "GUILD_TEXT",
                            parent: "627536301008224275",
                            permissionOverwrites: [
                                {
                                    id: message.author.id,
                                    allow: ["MANAGE_CHANNELS", "SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "ATTACH_FILES"],
                                },
                            ],
                        })
                        .then(async (c) => {
                            charge({ item: item, amount: 0, l10nCode: "channelPurchaseSuccess", toReplace: { channelLink: `${c}` } })
                            obj[dbName] = c.id
                            await guy.updateOne({ $set: obj })
                            c.send({ content: `${message.author}, here is your private channel!` })
                        })
                }
            }
        }
    },
}
