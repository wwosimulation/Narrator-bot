/* Examples
+player @Hackante#1482 gems add 2
+player 517335997172809728 lootbox set 4
+player Hackante#1482 badges remove halloween2021
*/

const players = require("../../schemas/players")
const { getUser } = require("../../config")
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = {
    name: "player",
    description: "Update many things in a players inventory.",
    usage: `${process.env.PREFIX}player <user> <column> <updateOperator> <value> [force]`,
    staffOnly: true,
    run: async (message, args, client) => {
        let target = getUser(args[0])
        let column = args[1]
        let operator = args[2]
        let value = args[3]
        let options = args[4] || "none"

        let columns = ["coins", "roses", "gems", "xp", "rose", "bouquet", "lootbox", "badge"]
        let operators = ["set", "add", "remove"]
        let force = false

        if (!target) return message.channel.send({ content: message.i10n("userInvalid", { user: target }) + `Use\n\`${this.usage}\`` })
        if (!columns.includes(column)) return message.channel.send({ content: `Invalid column! Available columns are ${columns.map((column) => `\`${column}\``).join(" ")}` })
        if (!operators.includes(operator)) return message.channel.send({ content: `Invalid operator! Available operators are ${operators.map((operator) => `\`${operator}\``).join(" ")}` })
        if (!value) return message.channel.send({ content: `Invalid usage! Use\n\`${this.usage}\`` })
        if (options !== "none" && ["-f", "force", "--force"].includes(options)) force = true

        let playerData = await players.findOne({ user: target.id })

        if (columns.slice(0, 7).includes(column)) {
            if (["rose", "bouquet", "lootbox"].includes(column)) column = `inventory.${column}`

            let update = {}
            let operatorObj = {}

            let amount = args[3]
            if (isNaN(args[3]) || amount % 1 != 0 || amount <= 0) return message.channel.send({ content: message.i10n("amountInvalid", { amount: amount }) })

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
                    if ((playerData && playerData.coins > amount) || force) {
                        update[column] = -amount
                        operatorObj["$inc"] = update
                    } else if (!playerData || !playerData[column] < amount) {
                        return message.channel.send({ content: `You try to remove more ${column} than the user has. If you want to continue run this command again with \`force\` at the end.` })
                    }
                    break
            }
            await players.updateOne({ user: target.id }, operatorObj, { upsert: true }) //upsert in case there is no player with this id
            message.channel.send({ content: `${capitalizeFirstLetter(column)} updated for ${target.user ? target.user.tag : target.tag}` })
        }
        if (column === "badges") {
            let update = {}
            let operatorObj = {}

            if (value === "invite") {
                switch (operator) {
                    case "add":
                        update["badges.invite.unlocked"] = true
                    case "remove":
                        update["badges.invite.unlocked"] = false
                    case "set":
                        return message.channel.send({ content: "This operator does not work for badges." })
                }
                operatorObj["$set"] = update
                await players.updateOne({ user: target.id }, operatorObj, { upsert: true })
                return message.channel.send({ content: message.i10n("done") })
            }

            switch (operator) {
                case "add":
                    update[value] = true
                    operatorObj["$set"] = update
                case "remove":
                    update[value] = playerData.badges[value]
                    operatorObj["$unset"] = update
                case "set":
                    return message.channel.send({ content: "This operator does not work for badges." })
            }
            await players.updateOne({ user: target.id }, operatorObj, { upsert: true })
            return message.channel.send({ content: message.i10n("done") })
        }
    },
}
