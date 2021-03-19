module.exports = (client) => {
  
  client.on('ready', () => {
    client.api.applications(client.user.id).guilds("465795320526274561").commands.post({
        data: {
            name: "ping",
            description: "See the bot's ping"
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
                        content: `Pong! ${client.ws.ping}`
                    }
                }
            })
        }
    });
});
  
  
  
  
  
}
