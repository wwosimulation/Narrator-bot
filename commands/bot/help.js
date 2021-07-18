const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    run: async (message, args) => {

        // help embed
        let embed = new MessageEmbed()
        .setColor(0x7419b4); 
        let cmd_target;
        // Checking if args[0] is a command
        if(args[0]) {
           cmd_target = client.commands.get(args[0].toLowerCase()) || client.commands.find(a => a.aliases && a.aliases.includes(args[0].toLowerCase()));
        }
        // If args[0] is a command, send a specific command card.
        if(cmd_target) {
            embed.setTitle(client.utils.capitalizeFirstLetter(cmd_target.name))
            .setDescription(
                `Prefix: \`${process.env.PREFIX}\`
                \`[]\` = optional argument
                \`<>\` = required argument

                Use ${process.env.PREFIX}help to see all commands.
                `
            )
            .addFields(
                {name: "Description", value: cmd_target.description || "No description added yet.zz"},
                {name: "Usage:", value: `\`${cmd_target.usage || "No usage given."}\``},
            )
            
            // if the command has aliases add those
            if(cmd_target.aliases){
                embed.addField({name: "Aliases:", value: `${cmd_target.aliases.length ? cmd_target.aliases.map(alias => `\`${alias}\``).join(' ') : "No aliases"}`})
            }
            
        }
        // if args[0] doesn't exist or it is not a command
        else{
            embed
            .setTitle("About Narrator Bot")
            .setDescription(
                `**__How to join a simulation game?__**
When a game is live, it will be announced in <#606123818305585167>. Click on the join game button to join a game server.
Read more about how to play in <#859001588617445436>. Ranked games will be announced in <#860552178095882240>.


Use following commands with <@744538701522010174>'s prefix (+).
`
            )
            .addField(message.i10n("economy"), message.i10n("helpEconomy"))
            .addField(message.i10n("fun"), message.i10n("helpFun"))
            .addField(message.i10n("bot"), message.i10n("helpBot"))
    
        message.channel.send({ embeds: [embed] })
            }
    },
}
