const config = require("../../config")
const pluralize = require("pluralize")
const { players } = require("../../db.js")

module.exports = {
    name: "buy",
    description: "Buy an item from the shop.",
    usage: `${process.env.PREFIX} <item | color>`,
    run: async (message, args, client) => {
        let data = await players.findOne({ user: message.author.id })
        const sim = client.guilds.cache.get(config.ids.server.sim)
        const roleadd = (x) => {
            sim.members.cache.get(message.author.id).roles.add(`${x}`)
        }
        const rolehas = (x) => {
            return sim.members.cache.get(message.author.id).roles.cache.has(x)
        }
        let color,
            amount = 0,
            dontbuy = false

        if (args.length < 1) return message.channel.send(message.l10n("noItemProvided"))

        args.forEach((x, i) => {
            args[i] = x.toLowerCase()
        })

        if (["color", "colour"].includes(args[1]) && !["gray", "grey"].includes(args[0])) args.reverse()

        let item = config.shop.items.find((x) => x.id == args[0])
        switch (args[0]) {
            case "roses":
                item = config.shop.items.find((x) => x.id == "rose")
                break
            case "rose":
                if (args[1] == "bouquet") item = config.shop.items.find((x) => x.id == "bouquet")
                break
            case "color":
                color = config.shop.colors.find((x) => x.name.toLowerCase() == args[1])
                break
            case "gray":
                color = config.shop.items.find((x) => x.id == "grey")
                break
            case "private":
                item = config.shop.items.find((x) => x.id == "channel")
                break
            case "game":
                item = config.shop.items.find((x) => x.id == "gamegifs")
                break
        }
        console.log(item, args)
        if (!item) return message.channel.send(message.l10n("noItemProvided"))

        let price = item.price || 0
        let userHas = item.currency == "coin" ? data.coins : item.currency == "rose" ? data.roses : data.gems

        if (item.id == "color" && !color) return message.channel.send(`${args[1]} is not in the available colors.\nMake sure you choose a proper color from \`+shop colors\`!`)

        if (item.role) {
            if (rolehas(item.role)) {
                dontbuy = true
                return message.channel.send(message.l10n("alreadyPurchasedRole"))
            }
        }
        if (item.id == "color") {
            if (rolehas(color.id)) {
                dontbuy = true
                return message.channel.send(message.l10n("alreadyPurchasedColor"))
            }
        }

        if (item.id == "cmi") {
            let cmicheck = data.cmi
            if (cmicheck) {
                dontbuy = true
                return message.channel.send(message.l10n("alreadyPurchasedItem", { item: item.name }))
            }
        }

        if (item.id == "special") {
            let specialrolesname = sim.roles.cache.get("606247032553865227")
            let colorsrolename = sim.roles.cache.get("606247387496972292")
            let allsprole = sim.roles.cache.filter((r) => r.position < specialrolesname.position && r.position > colorsrolename.position)
            let hassprole = false
            allsprole.forEach((e) => {
                if (sim.members.cache.get(message.author.id).roles.cache.has(e.id)) {
                    hassprole = true
                    if (!data.customRole) data.customRole = e.id
                }
            })
            if (hassprole == true) return message.channel.send(message.l10n("alreadyPurchasedItem", { item: "special role" }))
        }

        if (["rose", "bouquet"].includes(item.id)) {
            amount = parseInt(args[args.length - 1])
            if (!amount) amount = 1
        }

        if (dontbuy) return
        let totalPrice = (amount ? amount : 1) * item.price
        console.log(userHas, totalPrice)
        if (totalPrice > userHas) return message.channel.send(message.l10n("notEnoughCurrency", { currency: pluralize(item.currency) }))
        if (item.currency) data[item.currency] = data[item.currency] - totalPrice
        switch (item.currency) {
            case "coin":
                data.coins -= totalPrice
                break
            case "rose":
                data.roses -= totalPrice
                break
            case "gem":
                data.gems -= totalPrice
                break
        }

        if (item.role) {
            roleadd(item.role)
        } else if (item.color) {
            roleadd(color.id)
        } else if (item.id == "profile") {
            data.profile = true
        } else if (item.id == "special") {
            let colorsrolename = sim.roles.cache.get("606247387496972292")
            sim.roles
                .create({
                    name: `${message.author.username}'s Special role`,
                    color: "#007880",
                    position: colorsrolename.position + 1,
                })
                .then((role) => {
                    data.customRole = role.id
                    roleadd(role.id)
                })
        } else if (["rose", "bouquet", "description"].includes(item.id)) {
            data.inventory[item.id] += amount
        } else if (item.id == "private") {
            let t = await sim.channels.create(`${message.author.username}-channel`, {
                parent: "627536301008224275",
                permissionOverwrites: [
                    {
                        id: message.author.id,
                        allow: ["MANAGE_CHANNELS", "SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "ATTACH_FILES"],
                    },
                ],
            })
            await message.channel.send(message.l10n("channelPurchaseSuccess", { channelLink: `${t}` }))
            data.privateChannel = t.id
        }
        data.save()
        message.channel.send(`You have successfully purchased ${amount ? amount : "the"} ${color ? `${color.name} ` : ""}${pluralize(item.name, amount ? amount : 1)}!\nYou have been charged ${totalPrice} ${pluralize(item.currency)} ${config.getEmoji(item.currency, client)}!${item.response ? `\n${item.response}` : ""}`)
    },
}
