/* Examples
+player @Hackante#1482 gems add 2
+player 517335997172809728 lootbox set 4
+player Hackante#1482 badges remove halloween2021
*/

const players = require("../../schemas/players")
const { fn } = require("../../config")

module.exports = {
    name: "player",
    description: "Update many things in a players inventory.",
    usage: `${process.env.PREFIX}player <user> <column> <updateOperator> <value> [force]`,
    staffOnly: true,
    run: async (message, args, client) => {
        let target = fn.getUser(args[0], message)
        let column = args[1]
        let operator = args[2]
        let value = args[3]
        let options = args[4] || "none"
        let first

        let columns = ["coins", "roses", "gems", "xp", "rose", "bouquet", "lootbox", "badge"]
        let operators = ["set", "add", "remove"]
        let force = false

        if (!target) return message.channel.send({ content: message.l10n("userInvalid", { user: target }) + `Use\n\`${this.usage}\`` })
        if (!columns.includes(column)) return message.channel.send({ content: `Invalid column! Available columns are ${columns.map((column) => `\`${column}\``).join(" ")}` })
        if (!operators.includes(operator)) return message.channel.send({ content: `Invalid operator! Available operators are ${operators.map((operator) => `\`${operator}\``).join(" ")}` })
        if (!value) return message.channel.send({ content: `Invalid usage! Use\n\`${this.usage}\`` })
        if (options !== "none" && ["-f", "force", "--force"].includes(options)) force = true

        let playerData = await players.findOne({ user: target.id })

        if (columns.slice(0, 7).includes(column)) {
            if (["rose", "bouquet", "lootbox"].includes(column)) first = `inventory`

            let update = {}
            let operatorObj = {}

            let amount = args[3]
            if (isNaN(args[3]) || amount % 1 != 0 || amount <= 0) return message.channel.send({ content: message.l10n("amountInvalid", { amount: amount }) })

            switch (operator) {
                case "set":
                    update[column] = amount
                    operatorObj["$set"] = update
                    break
                case "add":
                    update[column] = amount
                    operatorObj["$inc"] = update
                    break
                case "remove":
                    if ((first && playerData && playerData[first][column] > amount) || (first && force)) {
                        update[first + "." + column] = -amount
                        operatorObj["$inc"] = update
                    } else if ((playerData && playerData[column] > amount) || force) {
                        update[column] = -amount
                        operatorObj["$inc"] = update
                    } else {
                        return message.channel.send({ content: `You try to remove more ${column.replace("inventory.", "")} than the user has. If you want to continue run this command again with \`force\` at the end.` })
                    }
                    break
            }
            await players.updateOne({ user: target.id }, operatorObj, { upsert: true }) //upsert in case there is no player with this id
            message.channel.send({ content: `${fn.capitalizeFirstLetter(column.replace("inventory.", ""))} updated for ${target.user ? target.user.tag : target.tag}` })
        }
        if (column === "badge") {
            let update = {}
            let operatorObj = {}

            if (value === "invite") {
                switch (operator) {
                    case "add":
                        update = { "badges.invite.unlocked": true }
                        break
                    case "remove":
                        update = { "badges.invite.unlocked": false }
                        break
                    case "set":
                        return message.channel.send({ content: "This operator does not work for badges." })
                }
                operatorObj["$set"] = update
                await players.updateOne({ user: target.id }, operatorObj, { upsert: true })
                return message.channel.send({ content: message.l10n("done") })
            }

            let updateStr
            switch (operator) {
                case "add":
                    updateStr = `badges.${value.toLowerCase()}`
                    update[updateStr] = true
                    operatorObj = { $set: update }
                    break
                case "remove":
                    updateStr = `badges.${value.toLowerCase()}`
                    update[updateStr] = true
                    operatorObj = { $unset: update }
                    break
                case "set":
                case "set":
                    return message.channel.send({ content: "This operator does not work for badges." })
            }
            await players.updateOne({ user: target.id }, operatorObj, { upsert: true })
            return message.channel.send({ content: message.l10n("done") })
        }
    },
}
