const Discord = require("discord.js");

const sim = ["465795320526274561"];
const game = ["472261911526768642"];
const both = ["465795320526274561", "472261911526768642"];

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

      if (command === "ping") {
        client.api
          .interactions(interaction.id, interaction.token)
          .callback.post({
            data: {
              type: 4,
              data: {
                content: `Pong! ${client.ws.ping} ms`,
              },
            },
          });
      }

      if (command === "stafflist") {
        let msg = `Only a staff member can regenerate the staff list!`;
        if (interaction.member.roles.includes("606138123260264488")) {
          client.emit("stafflist");
          msg = `Done!`;
        }
        client.api
          .interactions(interaction.id, interaction.token)
          .callback.post({
            data: {
              type: 4,
              data: {
                content: msg,
              },
            },
          });
      }

      if (command == "skip") {
        let msg = `You have voted to skip the discussion phase! This does nothing right now lmao`;
        
        let channel = client.channels.cache.get(interaction.channel_id);
        let guild = client.guilds.cache.get(interaction.guild_id);
        if (
          !interaction.member.roles.includes(
            guild.roles.cache.find((r) => r.name === "Alive").id
          )
        )
          msg = `You are not Alive! You cannot use this`;
          let isDay = await db.fetch(`isDay_${message.guild.id}`);
          let day = await db.fetch(`dayCount_${message.guild.id}`);
          let vote = db.get(`commandEnabled_${message.guild.id}`)
          let skipus = db.get(`skipus_${message.author.id}`)
          if (day < 5) msg = "You can only skip after Day 5!"
          if (isDay != "yes" && vote == "yes") {
            msg = 
              "You can only skip the discussion phase during the day!"
          }
          let alive = message.guild.roles.cache.find(r => r.name === "Alive");
        client.api
          .interactions(interaction.id, interaction.token)
          .callback.post({
            data: {
              type: 4,
              data: {
                content: msg,
                flags: 1 << 6,
              },
            },
          });
      }
    });
  });
};
