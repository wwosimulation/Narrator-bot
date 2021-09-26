/*
+player <user> <column> <operator> <value>

["coins", "roses", "gems", "xp", "rose", "bouquet", "lootbox", "badge"]
["set", "add", "remove"]
*/

module.exports = {
    command: {
        name: "player",
        description: "Update multiple currencies/values for a player in the economy system!",
        options: [
            {
                type: "USER",
                name: "player",
                description: "Enter the player to be updated.",
                required: true,
            },
            {
                type: "STRING",
                name: "column",
                description: "Select the column to be updated.",
                required: true,
                choices: [
                    { name: "coins", value: "coins" },
                    { name: "roses", value: "roses" },
                    { name: "gems", value: "gems" },
                    { name: "xp", value: "xp" },
                    { name: "rose", value: "rose" },
                    { name: "bouquet", value: "bouquet" },
                    { name: "lootbox", value: "lootbox" },
                    { name: "badge", value: "badge" },
                ],
            },
            {
                type: "STRING",
                name: "operator",
                description: 'Select the way you want to update the value. NOTE: You can\'t "set" a badge.',
                required: true,
                choices: [
                    { name: "set", value: "set" },
                    { name: "add", value: "add" },
                    { name: "remove", value: "remove" },
                ],
            },
            {
                type: "STRING",
                name: "value",
                description: "Add the value you want to use with the operator.",
                required: true,
            },
            {
                type: "STRING",
                name: "options",
                description: "Select options you want to add to your request.",
                required: false,
            },
        ],
        defaultPermission: false,
    },
    permissions: {
        sim: [
            { id: "606138123260264488", type: "ROLE", permission: true }, // @Staff
            { id: "606167032425218084", type: "ROLE", permission: false }, // @Member
        ],
        game: [
            { id: "606139219395608603", type: "ROLE", permission: true }, // @Narrator
            { id: "606276949689499648", type: "ROLE", permission: true }, // @Narrator Trainee
            { id: "606131215526789120", type: "ROLE", permission: false }, // @Player
        ],
    },
    server: ["sim", "game"],
    run: async (interaction, client) => {
        let target = interaction.options.getUser("player")
        let column = interaction.options.getString("column")
        let operator = interaction.options.getString("operator")
        let value = interaction.options.getString("value")
        let options = interaction.options.getString("options") || "none"

        let columns = ["coins", "roses", "gems", "xp", "rose", "bouquet", "lootbox", "badge"]
        let operators = ["set", "add", "remove"]
        let force = false

        if (!target) return interaction.reply({ content: `Invalid player! Use\n\`${this.usage}\``, ephemeral: true })
        if (!columns.includes(column)) return interaction.reply({ content: `Invalid column! Available columns are ${columns.map((column) => `\`${column}\``).join(" ")}`, ephemeral: true })
        if (!operators.includes(operator)) return interaction.reply({ content: `Invalid operator! Available operators are ${operators.map((operator) => `\`${operator}\``).join(" ")}`, ephemeral: true })
        if (!value) return interaction.reply({ content: `Invalid usage! Use\n\`${this.usage}\``, ephemeral: true })
        if (options !== "none" && ["-f", "force", "--force"].includes(options)) force = true

        let playerData = await players.findOne({ user: target.id })

        if (column === "coins" || column === "roses" || column === "gems" || column === "xp" || column === "rose" || column === "bouquet" || column === "lootbox") {
            if (column === "rose" || column === "bouquet" || column === "lootbox") column = `inventory.${column}`

            let update = {}
            let operatorObj = {}

            let amount = value
            if (isNaN(value) || amount % 1 != 0 || amount <= 0) return interaction.reply({ content: message.i10n("amountInvalid", { amount: amount }), ephemeral: true })

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
                        return interaction.reply({ content: `You try to remove more ${column} than the user has. If you want to continue run this command again with \`force\` as option.`, ephemeral: true })
                    }
                    break
            }
            await players.updateOne({ user: target.id }, operatorObj, { upsert: true }) //upsert in case there is no player with this id
            interaction.reply({ content: `${capitalizeFirstLetter(column)} updated for ${target.tag}` })
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
                        return interaction.reply({ content: "This operator does not work for badges.", ephemeral: true })
                }
                operatorObj["$set"] = update
                await players.updateOne({ user: target.id }, operatorObj, { upsert: true })
                return interaction.reply({ content: message.i10n("done") })
            }

            switch (operator) {
                case "add":
                    update[value] = true
                    operatorObj["$set"] = update
                case "remove":
                    update[value] = playerData.badges[value]
                    operatorObj["$unset"] = update
                case "set":
                    return interaction.reply({ content: "This operator does not work for badges.", ephemeral: true })
            }
            await players.updateOne({ user: target.id }, operatorObj, { upsert: true })
            return interaction.reply({ content: message.i10n("done") })
        }
    },
}
