const { ids } = require("../../config");

module.exports = {
    command: {
        name: "gamewarn",
        description: "List, add, and delete gamewarns. Some commands might not work for you.",
        options: [{
            type: "SUBCOMMAND",
            name: "add",
            description: "",
        }]
    },
    permissions: {
        sim: [
            { id: ids.staff, type: "ROLE", permission: true }, // @Staff
            { id: ids.afkstaff, type: "ROLE", permissions: true }, //@AFK STAFF
            { id: "606167032425218084", type: "ROLE", permission: true }, // @Member
        ],
        game: [
            { id: ids.narrator, type: "ROLE", permission: true }, // @Narrator
            { id: ids.mini, type: "ROLE", permission: true }, // @Narrator Trainee
            { id: ids.player, type: "ROLE", permission: true }, // @Player 
        ],
    },
    run: async (interaction, client) => {
        
    }
}