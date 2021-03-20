const Discord = require("discord.js")

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
    client.api.applications(client.user.id).guilds("472261911526768642").commands.post({
        data: {
            name: "skip",
            description: "Skip the discussion phase"
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

        if(command == "skip"){
            let msg = `You have voted to skip the discussion phase! This does nothing right now lmao`
            // let message = new Discord.Message()
            let channel = client.channels.cache.get(interaction.channel_id)
            let guild = client.guilds.cache.get(interaction.guild_id)
            if(!interaction.member.roles.includes(guild.roles.cache.find(r => r.name === "Alive").id)) msg = `You are not Alive! You cannot use this`
            // message.member = message.guild.members.cache.get(interaction.member.user.id)
            // client.commands.get("skip").run(message, args, client)
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: msg,
                        flags: 1 << 6
                    }
                }
            })
        }
        
    });
});
  
  
  
  
  
}
