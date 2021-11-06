const { shop } = require("../../config/src")
const pluralize = require("pluralize")
const { players } = require("../../db.js")
const { colors, items } = require("../../config/src/shop")
const { server } = require("../../config/src/ids")

module.exports = {
    name: "buy",
    description: "Buy an item from the shop.",
    usage: `${process.env.PREFIX}buy <item | <color> (color)>`,
    run: async (message, args, client) => {
        // functions
        let sim = client.guilds.resolve(server.sim)
        let guy = await players.findOne({user: message.author.id})
        let failMessage = (l10nCode, toReplace = {}) => {
            return message.channel.send(message.l10n(l10nCode, toReplace)), false
        }
        let successMsg = ({l10nSupport = false, l10nCode = "", toReplace = {}, amount = null, color = null, item = null}) => {
            if(l10nSupport) return message.channel.send(message.l10n(l10nCode, toReplace))
            else return message.channel.send(`You have successfully purchased ${amount ? amount : "the"} ${color ? `${color.name} ` : ""}${pluralize(item.name, amount ? amount : 1)}!\nYou have been charged ${item.price} ${pluralize(item.currency)} ${config.getEmoji(item.currency, client)}!${item.response ? `\n${item.response}` : ""}`)
        }
        let appplyRole = (roleID, color = false) => {
            let guyz = sim.members.find((member) => member.id === message.author.id)
            if(!guyz) return failMessage("userInvalid", {user: message.author})
            else guyz.roles.cache.has(roleID) ? (color === false ? failMessage("alreadyPurchasedRole") : failMessage("alreadyPurchasedColor")) : guyz.roles.add(roleID)
        }
        let charge = async (itemID, success = {amount = 1, l10nSupport = false, l10nCode = "", toReplace = {}, amount = null, color = null, item: itemID = null}) => {
            let itemm = items.find((itemz) => itemz.id === itemID)
            if(!itemm) return failMessage("noItemProvided")
            if(guy[itemm.currency] < itemm.price) return failMessage("notEnoughCurrency", {currency: itemm.currency})
            let update = {}
            update[itemm.currency] = itemm.price * amount
            await guy.updateOne({$inc:update})
            return successMsg(success)
        }

        //checking arguments
        if(!args[0]) return failMessage("noItemProvided")
        if(["color", "colour"].includes(args[0]) && !args[1]) return message.reply({content:`Please choose a color from \`${process.env.PREFIX}shop colors\`!\nThe correct usage for this command is \`${process.env.PREFIX}buy color <color>\``, allowMention:{repliedUser: false}})
        
        // Color Roles:
        if(["color", "colour"].includes(args[0]) || ["color", "colour"].includes(args[1])) {
            if(["color", "colour"].includes(args[0])) args.shift()
            colors.forEach(color => {
                if(color.name === args[0]) {
                    charge("color", {color: color})
                    return appplyRole(color.id, true)
                }
            })
        }
        else {
            for(let item of items){
                if(!item.id === args[0]) return
                // Other Roles
                if(item.role) {
                    charge(item.id, {item: item})
                    return appplyRole(item.role)
                }
                // Inventory Items
                if(["rose", "bouquet"].includes(item.id)) {
                    let obj = {}
                    obj[`inventory.${item.id}`] = parseInt(args[2]) || 1
                    await guy.updateOne({$inc:obj})
                    return charge(item.id, {amount: parseInt(args[2]) || 1, item: item})
                }
                let dbName
                switch(item.id){
                    case("description"): dbName = "profileDesc"
                    case("icon"): dbName = "profileIcon"
                    case("special"): dbName = "customRole"
                    case("channel"): dbName = "privateChannel"
                    default: dbName = item.id
                }
                if(guy[dbName] !== false || guy[dbName] !== "") return failMessage("alreadyPurchasedItem", {item: item.name})
                // Boolean values
                if(["profile", "cmi"].includes(dbName)) {
                    let obj = {}
                    obj[dbName] = true
                    await guy.updateOne({$set:obj})
                    return charge(item, {item: item})
                }
                // Description + Icon
                if(["description", "icon"].includes(item.id)) {
                    args.shift()
                    let value = args[0] ? args.join(" ") : item.id === "description" ? `Hey there! I am <@${message.author.id}>` : "https://i.imgur.com/6fL8AD2.png"
                    let obj = {}
                    obj[dbName] = value
                    await guy.updateOne({$set:obj})
                    return charge(item.id, {item:item})
                }
                // Custom Role and Channel
                if(["special", "channel"].includes(item.id)) {
                    let obj = {}
                    // Role
                    if(item.id === "special") {
                        let colorRolesStart = sim.roles.cache.get("606247387496972292")
                        sim.roles.create({
                            name: `${message.author.username}'s Special Role`,
                            color: "#007880",
                            position: colorRolesStart.position + 1,
                            reason: message.author. tag + " bought special role item"
                        }).then((role) => {
                            appplyRole(role.id)
                            await guy.updateOne({$set:obj})
                            charge(item.id, {item: item})
                            obj[dbName] = role.id
                        })
                    }
                    if(item.id === "channel") {
                        sim.channels.create(`${message.author.username}-channel`, {
                            parent: "627536301008224275",
                            permissionOverwrites: [
                                {
                                    id: message.author.id,
                                    allow: ["MANAGE_CHANNELS", "SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "ATTACH_FILES"],
                                },
                            ],
                        }).then((c) => {
                            charge(item.id, {l10nSupport: true, l10nCode: "channelPurchaseSuccess", toReplace: {channelLink: `${c}`}})
                            obj[dbName] = c.id
                            await guy.updateOne({$set:obj})
                        })
                    }
                }
            }
        }
    }
}