/*
+player <user> <column> <operator> <value>

["coins", "roses", "gems", "xp", "rose", "bouquet", "lootbox", "badge"]
["set", "add", "remove"]
*/
const players = require("../../schemas/players")
const { ids, fn } = require("../../config")

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
                    { name: "Coins", value: "coins" },
                    { name: "Roses (currency)", value: "roses" },
                    { name: "Gems", value: "gems" },
                    { name: "XP", value: "xp" },
                    { name: "Rose (tradeable)", value: "rose" },
                    { name: "Bouquets", value: "bouquet" },
                    { name: "Lootboxes", value: "lootbox" },
                    { name: "Badges", value: "badge" },
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
                autocomplete: true,
            },
            {
                type: "BOOLEAN",
                name: "forced",
                description: "Force this action (required for making values negative)",
                required: false,
            },
        ],
        defaultPermission: false,
    },
    permissions: {
        sim: [
            { id: ids.staff, type: "ROLE", permission: true }, // @Staff
            { id: ids.afkstaff, type: "ROLE", permission: true }, //@AFK STAFF
            { id: "606167032425218084", type: "ROLE", permission: false }, // @Member
        ],
        game: [
            { id: ids.narrator, type: "ROLE", permission: true }, // @Narrator
            { id: ids.mini, type: "ROLE", permission: true }, // @Narrator Trainee
            { id: ids.player, type: "ROLE", permission: false }, // @Player 
        ],
    },
    server: ["sim", "game"],
    run: async (interaction, client) => {
        let target = interaction.options.getUser("player")
        let column = interaction.options.getString("column")
        let operator = interaction.options.getString("operator")
        let value = interaction.options.getString("value")
        let force = interaction.options.getString("options", false) || false

        let columns = ["coins", "roses", "gems", "xp", "rose", "bouquet", "lootbox", "badge"]
        let operators = ["set", "add", "remove"]
        let first

        let playerData = await players.findOne({ user: target.id }) || await players.create({user: target.id})

        if(["coins", "roses", "gems", "xp"].includes(column)) {
            // player.-column-
        } else if(["rose", "bouquet", "lootbox"].includes(column)) {
            // player.inventory.-column-
        } else if(["badges"].includes(column)) {
            // player.badges.-value-
        } else {
            return interaction.l10n("error")
        }
        /*
        if (column !== "badge") {
            if (["rose", "bouquet", "lootbox"].includes(column)) first = "inventory"

            let update = {}
            let operatorObj = {}

            let amount = value
            if (isNaN(value) || amount % 1 != 0 || amount <= 0) return interaction.reply({ content: interaction.l10n("amountInvalid", { amount: amount }), ephemeral: true })

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
                    if ((first && playerData && playerData[column] > amount) || (first && force)) {
                        update[first + "." + column] = -amount
                        operatorObj["$inc"] = update
                    } else if ((playerData && playerData[column] > amount) || force) {
                    } else {
                        return interaction.reply({ content: `You try to remove more ${column} than the user has. If you want to continue run this command again with \`force\` as option.`, ephemeral: true })
                    }
                    break
            }
            await players.updateOne({ user: target.id }, operatorObj, { upsert: true }) //upsert in case there is no player with this id
            interaction.reply({ content: `${fn.capitalizeFirstLetter(column)} updated for ${target.tag}` })
        }
        if (column === "badge") {
            console.log(operator)
            let update = {}
            let operatorObj = {}
            value.replace(/ /g, "_")

            if (value === "invite") {
                switch (operator) {
                    case "add":
                        update = { "badges.invite.unlocked": true }
                        break
                    case "remove":
                        update = { "badges.invite.unlocked": false }
                        break
                    case "set":
                        return interaction.reply({ content: "This operator does not work for badges.", ephemeral: true })
                }
                operatorObj = { $set: update }
                await players.updateOne({ user: target.id }, operatorObj, { upsert: true })
                return interaction.reply({ content: interaction.l10n("done") })
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
                    return interaction.reply({ content: "This operator does not work for badges.", ephemeral: true })
            }
            await players.updateOne({ user: target.id }, operatorObj, { upsert: true })
            return interaction.reply({ content: interaction.l10n("done") })
        }*/
    },
}
