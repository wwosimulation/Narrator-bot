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
        let force = interaction.options.getBoolean("forced", false) || false

        let playerData = (await players.findOne({ user: target.id })) || (await players.create({ user: target.id }))
        let verifyInt = (int) => {
            if (int % 1 != 0) return false
            if (int < 0 && !force) return false
            return true
        }

        let update = new Object()
        let changes = new Object()

        if (["coins", "roses", "gems", "xp", "rose", "bouquet", "lootbox"].includes(column)) {
            if (!verifyInt(value)) return interaction.reply({ content: interaction.l10n("amountInvalid", { amount: value }), ephemeral: true })
            value = parseInt(value)

            if (operator == "remove" && (playerData[column] ?? playerData.inventory[column]) < value && !force) return interaction.reply({ content: `You are trying to remove more \`${column}\` than the user has. Please use the command again with the \`force\` option set to \`true\` to force this option!`, ephemeral: true })
            column = ["coins", "roses", "gems", "xp"].includes(column) ? column : "inventory." + column

            changes[column] = operator == "remove" ? -value : value
            update[operator == "set" ? "$set" : "$inc"] = changes
        } else if (["badge"].includes(column)) {
            if (operator == "set") return interaction.reply({ content: "This operator does not work for badges." })
            value.replace(/ /g, "_").replace(/-/g, "_")
            changes["badges." + value] = true
            update[operator == "add" ? "$set" : "$unset"] = changes
            update["$inc"] = force ? { gems: operator == "add" ? 0 : -5 } : { gems: operator == "add" ? 5 : 0 }
        } else {
            return interaction.reply(interaction.l10n("error"))
        }
        await playerData.updateOne(update)

        interaction.reply({ content: `${fn.capitalizeFirstLetter(column.split(".")[1] || column)} updated!` })
    },
}
