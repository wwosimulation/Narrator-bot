const shuffle = require('shuffle-array') 

module.exports = (client) => {
  
  client.on('ready', () => {
    client.api.applications(client.user.id).guilds("465795320526274561").commands.post({
        data: {
            name: "ping",
            description: "See the bot's ping"
        }
    });
    client.api.applications(client.user.id).guilds("465795320526274561").commands.post({
        data: {
            name: "stafflist",
            description: "Regenerate the staff list"
        }
    });


    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

        if (command === 'ping'){ 
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: `Pong! ${client.ws.ping} ms`
                    }
                }
            })
        }
        
        if (command === 'stafflist'){ 
            let msg = `Only a staff member can regenerate the staff list!`
            if(interaction.member.roles.includes("606138123260264488")){
                client.emit("stafflist")
                msg = `Done!`
            }
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: msg
                    }
                }
            })
        }
        
    });
});
  
  
  
  
  
}
