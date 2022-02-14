const { ids } = require("../../config")

module.exports = {
    command: {
        name: "gamewarn",
        description: "List, add and delete gamewarns. Some commands might not work for you.",
        options: [
            {
                type: "SUB_COMMAND",
                name: "add",
                description: "Give a game warning to a user for violating the game rules.",
                options: [{
                    type: "USER",
                    name: "user",
                    description: "The user that should receive a game warning.",
                    required: true
                }, {
                    type: "STRING",
                    name: "reason",
                    description: "Name the reason for the game warning."
                }, {
                    type: "STRING",
                    name: "gamecode",
                    description: "The game code if this warning is given during a game."
                }]
            }, {
                type: "SUB_COMMAND",
                name: "remove",
                description: "Delete a game warning of a user.",
                options: [{
                    type: "INTEGER",
                    name: "index",
                    description: "The case/index of the warning to remove.",
                    required: true
                }]
            }, {
                type: "SUB_COMMAND",
                name: "list",
                description: "Show all (active) game warnings of a user or yourself.",
                options: [{
                    type: "USER",
                    name: "user",
                    description: "The user who's game warnings should be listed below.",
                    required: false
                }]
            },
        ],
    },
    permissions: {
        sim: [
            { id: ids.staff, type: "ROLE", permission: true }, // @Staff
            { id: ids.afkstaff, type: "ROLE", permission: true }, //@AFK STAFF
            { id: "606167032425218084", type: "ROLE", permission: true }, // @Member
        ],
        game: [
            { id: ids.narrator, type: "ROLE", permission: true }, // @Narrator
            { id: ids.mini, type: "ROLE", permission: true }, // @Narrator Trainee
            { id: ids.player, type: "ROLE", permission: true }, // @Player
        ],
    },
    server: ["sim", "game"],
    run: async (interaction, client) => {},
}