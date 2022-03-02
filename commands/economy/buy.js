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
        function l10nMesssage({ code, toReplace = {} }) {
            message.channel.send(message.l10n(code, toReplace))
        }
        function hasRole(roleID) {
            return client.guilds
                .resolve(server.sim)
                .members.cache.find((m) => m.id === message.author.id)
                .roles.cache.has(roleID)
                ? true
                : false
        }
        function enoughMoney(item, amount = 1) {
            return message.dbUser[item.currency + "s"] < item.price * amount ? false : true
        }

        let sim = client.guilds.resolve(server.sim)
        let guy = await players.findOne({ user: message.author.id })
        let l10n = { code: "noItemProvided" }
        var chart = {}
        obj = {}
        let info = { amount: null, roleID: "", channelID: "" }

        if (!args[0]) l10nMesssage(l10n)
        args.forEach((x, i) => {
            args[i] = x.toLowerCase()
        })

        // aliases for items
        args.forEach((arg, i) => {
            if (["gray", "private", "game", "roses"].indexOf(arg) === -1) args[i] = arg
            else {
                let ind = ["gray", "private", "game", "roses"].indexOf(arg)
                args[i] = ["grey", "channel", "gamegifs", "rose"][ind]
            }
        })
        if (["color", "colour"].includes(args[0]) && !args[1]) return message.reply({ content: `Please choose a color from \`${process.env.PREFIX}shop colors\`!\nThe correct usage for this command is \`${process.env.PREFIX}buy color <color>\``, allowedMentions: { repliedUser: false } })
        if (["color", "colour"].includes(args[0]) || ["color", "colour"].includes(args[1])) {
            if (["color", "colour"].includes(args[0])) args.shift()

            let color = colors.find((c) => c.name.toLowerCase() === args[0])
            if (!color) return l10nMesssage({ code: "unknownColor", toReplace: { color: args[0] } })

            if (!hasRole(color.id)) (chart = items.find((i) => i.id === "color")), (chart["color"] = color)
            else return l10nMesssage("alreadyPurchasedColor")
            if (!enoughMoney(chart)) return l10nMesssage({ code: "notEnoughCurrency", toReplace: { currency: chart.currency + "s" } })
        } else {
            if (args[0] === "rose" && args[1] && args[1] === "bouquet") args.shift()
            let item = items.find((element) => element.id === args[0])
            if (!item) return l10nMesssage(l10n)

            if (item.role) {
                if (!hasRole(item.role)) chart = item
                else return l10nMesssage({ code: "alreadyPurchasedItem", toReplace: { item: item.name } })
            }

            if (["rose", "bouquet"].includes(item.id)) {
                obj[`inventory.${item.id}`] = parseInt(args[2] || args[1]) || 1
                info["amount"] = parseInt(args[2] || args[1]) || 1
            }
            let dbName
            let i = ["description", "icon", "special", "channel"].indexOf(item.id)
            if (i == -1 && !obj[`inventory.${item.id}`] && !chart.id) dbName = item.id
            else dbName = ["profileDesc", "profileIcon", "customRole", "privateChannel"][i]
            if (dbName && guy[dbName] !== false && guy[dbName] !== "") return l10nMesssage({ code: "alreadyPurchasedItem", toReplace: { item: item.name } })

            if (!enoughMoney(item, info.amount || 1)) return l10nMesssage({ code: "notEnoughCurrency", toReplace: { currency: item.currency + "s" } })

            if (["profile", "cmi"].includes(dbName)) {
                obj[dbName] = true
            }

            if (["description", "icon"].includes(item.id)) {
                args.shift()
                let value = args[0] ? args.join(" ") : item.id === "description" ? `Hey there! I am <@${message.author.id}>` : "https://i.imgur.com/6fL8AD2.png"
                obj[dbName] = value
            }

            if (["special", "channel"].includes(item.id)) {
                if (item.id === "special") {
                    let colorRolesStart = sim.roles.cache.get("606247387496972292")
                    await sim.roles
                        .create({
                            name: `${message.author.username}'s Special Role`,
                            color: "#007880",
                            position: colorRolesStart.position + 1,
                            reason: message.author.tag + " bought special role item",
                        })
                        .then((role) => {
                            sim.members.resolve(message.author.id).roles.add(role.id)
                            obj[dbName] = role.id
                        })
                }
                if (item.id === "channel") {
                    await sim.channels
                        .create(`${message.author.username}-channel`, {
                            type: "GUILD_TEXT",
                            parent: "627536301008224275",
                            topic: `Owned by: <@${message.author.id}>`,
                            permissionOverwrites: [
                                {
                                    id: message.author,
                                    allow: ["MANAGE_CHANNELS", "SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "ATTACH_FILES"],
                                    type: "member",
                                },
                            ],
                        })
                        .then(async (c) => {
                            l10nMesssage({ code: "channelPurchaseSuccess", toReplace: { channelLink: `${c}` } })
                            obj[dbName] = c.id
                            c.send({ content: `${message.author}, here is your private channel!\n Please contact a staff memeber to adjust the channel permissions.` })
                        })
                }
            }
            chart = item
        }

        let update = {}
        let price = chart.price * (info.amount || 1)
        let op = "$set"
        if (["rose", "bouquet"].includes(chart.id)) {
            op = "$inc"
            obj[chart.currency + "s"] = -price
        } else {
            let pay = {}
            pay[chart.currency + "s"] = -price
            update["$inc"] = pay
        }
        update[op] = obj
        await players.findOneAndUpdate({ user: message.author.id }, update)
        message.channel.send(`You have successfully purchased ${info.amount ? info.amount : "the"} ${chart.color ? `${chart.color.name}` : ""}${chart.name.includes(" ") ? chart.name : pluralize(chart.name, info.amount ? info.amount : 1)}!\nYou have been charged ${pluralize(pluralize.singular(chart.currency), price, true)} ${getEmoji(pluralize.singular(chart.currency == "rose" ? "rosesingle" : chart.currency), client)}!${chart.response ? `\n${chart.response}` : ""}`)

        let roleID = chart.color ? chart.color.id : chart.role ? chart.role : null
        if (roleID) sim.members.resolve(message.author.id).roles.add(roleID)
        console.log(update)
        return
    },
}
