const Discord = require("discord.js")
const db = require("quick.db")
const ms = require("ms")

const defaultOptions = {
  private: false,
}

const allCommands = [
  {
    command: "ping",
    description: "See the bot's ping",
  },
  {
    command: "serverinfo",
    description: "Test"
  },
  {
    command: "timer",
    description: "Set a timer for a certain amount of time",
    options: [{ type: 3, name: "Time", description: "length of timer", required: true }],
  }
]

module.exports = (client) => {
  const baseReply = (msg, interaction, options = {}) => {
    for (let o in defaultOptions) {
      if (!options[o]) options[o] = defaultOptions[o]
    }
    let sendData = { content: msg }
    if (options.private) sendData.flags = 1 << 6
    let data = { type: 4, data: sendData }
    client.api.interactions(interaction.id, interaction.token).callback.post({ data })
  }

  client.on("ready", () => {
    allCommands.forEach((cmd) => {
      client.guilds.cache.keyArray("id").forEach((x) => {
        let data = {
          name: cmd.command,
          description: cmd.description,
        }
        if (cmd.options) data.options = cmd.options
        client.api.applications(client.user.id).guilds(x).commands.post({ data })
      })
    })

    client.ws.on("INTERACTION_CREATE", async (interaction) => {
      const command = interaction.data.name.toLowerCase()
      const args = interaction.data.options

      if (command === "ping") return baseReply(`Pong! ${client.ws.ping} ms`, interaction)


      if (command == "timer") {
        let timer = ms(args[0].value)
        if (!timer) return message.channel.send("Invalid time format!")
        baseReply(`Setting the time for ${ms(timer)}`, interaction)
        setTimeout(function () {
            client.channels.cache.get(interaction.channel_id).send(`Time is up! <@${interaction.member.user.id}>`)
        }, timer)//.catch(e => message.channel.send(`Error: ${e.message}`))
      }

      if (command == "serverinfo") {
        baseReply("Test", interaction)
      }
    })
  })
}
