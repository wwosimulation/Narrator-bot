const Discord = require("discord.js");
const db = require("quick.db");

const sim = ["465795320526274561"];
const game = ["472261911526768642"];
const both = ["465795320526274561", "472261911526768642"];

const defaultOptions = {
    private: false
}

const allCommands = [
  {
    command: "ping",
    description: "See the bot's ping",
    server: both,
  },
  {
    command: "stafflist",
    description: "Regenerate the staff list",
    server: sim,
  },
  {
    command: "skip",
    description: "Skip the discussion phase (only after day 5)",
    server: game,
  },
];

module.exports = (client) => {
    
const baseReply = (msg, interaction, options = {}) => {
    for(let o in defaultOptions){
        if(!options[o]) options[o] = defaultOptions[o]
    }
    let sendData = {content: msg}
    if(options.private) sendData.flags = 1 << 6
    let data = {type: 4, data: sendData}
    client.api.interactions(interaction.id, interaction.token).callback.post({data});
  };

  client.on("ready", () => {
    allCommands.forEach((cmd) => {
      cmd.server.forEach((x) => {
        client.api
          .applications(client.user.id)
          .guilds(x)
          .commands.post({
            data: {
              name: cmd.command,
              description: cmd.description,
            },
          });
      });
    });

    client.ws.on("INTERACTION_CREATE", async (interaction) => {
      const command = interaction.data.name.toLowerCase();
      const args = interaction.data.options;
      
      client.channels.cache.get("783013534560419880").send(`Slash Command ran: **${command}**\nArguments: **${"None"}**\nAuthor: ${interaction.member.user.tag} (${interaction.member.user.id})`)

      if (command === "ping") return baseReply(`Pong! ${client.ws.ping} ms`, interaction)

      if (command === "stafflist") {
        let msg = `Only a staff member can regenerate the staff list!`;
        if (!interaction.member.roles.includes("606138123260264488")) baseReply(`Only a staff member can regenerate the staff list!`, interaction)
        client.emit("stafflist");
        baseReply(`Done!`, interaction)
      }

      if (command == "skip") {
        console.log(interaction)
        let channel = client.channels.cache.get(interaction.channel_id);
        let guild = client.guilds.cache.get(interaction.guild_id);
        if (
          !interaction.member.roles.includes(
            guild.roles.cache.find((r) => r.name === "Alive").id
          )
        )
          return baseReply(
            `You are not Alive! You cannot use this`,
            interaction, {private: true}
          );
        let isDay = await db.fetch(`isDay_${guild.id}`);
        let day = await db.fetch(`dayCount_${guild.id}`);
        let vote = db.get(`commandEnabled_${guild.id}`);
        let skipus = db.get(`skipus_${interaction.member.user.id}`)
        if (day < 5)
          return baseReply("You can only skip after Day 5!", interaction);
        if (isDay != "yes" || vote == "yes") {
          return baseReply(
            "You can only skip the discussion phase during the day!",
            interaction, {private: true}
          );
        }
        let alive = guild.roles.cache.find((r) => r.name === "Alive");
        if (alive.members.size > 8) {
            return baseReply(
              "You can only skip the discussion phase if there are 8 or less players alive!", interaction, {private: true}
            );
          } else {
            if (skipus == true) return baseReply("You already voted to skip the discussion phase!", interaction, {private: true})
            let dayChat = guild.channels.cache.find(c => c.name === 'day-chat') 
            let commands = guild.channels.cache.find(c => c.name === 'commands')  
            dayChat.send(`Someone voted to skip the discussion phase!`)
            commands.send(`${interaction.member.nick} decided to skip the discussion phase!`)
            db.add(`skippedpl`, 1)
            if (db.get(`skippedpl`) == alive.members.size - 1) {
                let message = new Discord.Message()
                message.slashGenerate = true
                message.guild = guild
                dayChat.send(`Enough players voted to skip the discussion phase!`)
                commands.send("Starting voting phase due to skips")
                client.commands.get("vt").run(message, ["nm", process.env.SHADOW], client)
            }
          }
      }
    });
  });
};

