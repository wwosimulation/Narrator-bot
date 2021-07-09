const db = require("quick.db")
const { MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
    name: "joingame",
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        if (args[0] == "started") {
            db.set("started", "yes")
            message.react("👍")
        } else if (args[0] == "ended") {
            db.set("started", "no")
            message.react("👍")
            // } else if (args[0] == "code") {
            //   let join = new MessageButton().setStyle("SUCCESS").setLabel("Join Game").setCustomId("igjoin")
            //   let spec = new MessageButton().setStyle("PRIMARY").setLabel("Spectate").setCustomId("igspec")
            //   const enterbtn = new MessageActionRow().addComponents(join,spec)
            //   const lobbybtn = new MessageActionRow().addComponents(spec)
            //   let enter = await message.guild.channels.cache.get("606132299372822582").send("Welcome to the game! Select an option below.", {components: [enterbtn]})
            //   let lobby = await message.guild.channels.cache.get("606132387587293195").send("If you would like to spectate the game instead of play, click the button below", {components: [lobbybtn]})
            //   db.set(`entermsg`, enter.id)
            //   db.set(`lobbymsg`, lobby.id)
        }
    },
}

/* 
+eval let join = new Discord.MessageButton().setStyle("SUCCESS").setLabel("Join Game").setCustomId("igjoin");
let spec = new Discord.MessageButton().setStyle("PRIMARY").setLabel("Spectate").setCustomId("igspec");
const enterbtn = new Discord.MessageActionRow().addComponents(join,spec);
const lobbybtn = new Discord.MessageActionRow().addComponents(spec);
message.channel.messages.fetch("853192704333840414").then(m => m.edit({content: m.content, components: [lobbybtn]}))

*/
