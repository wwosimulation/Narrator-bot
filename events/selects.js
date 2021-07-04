const db = require("quick.db")
const { shop } = require("../config")
const db = require("quick.db")

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isSelectMenu()) return
        console.log(interaction.customID)
        if (interaction.customID == "ig-voting") {
          let alive = interaction.guild.roles.cache.find(r => r.name === "Alive")
          let vtchat = interaction.guild.channels.cache.find(c => c.name.includes("vote"))
          if (!interaction.member.roles.cache.has(alive.id)) return interaction.reply({ content: "You can only vote if you are a player and alive!", ephemeral: true })
          if (interaction.values[0] == interaction.member.nickname) return interaction.reply({ content: "Lmao imagine voting yourself...", ephemeral: true })
          if (db.get(`commandEnabled`) == "no") return interaction.reply({ content: "Voting has ended. Sorry not sorry...", ephemeral: true })
          if (interaction.values[0] == "0") {
            let bruh = db.get(`votemsgid_${interaction.member.id}`)
            if (bruh) {
              let godei = await vtchat.messages.fetch(bruh).catch(e => e)
              if (godei.id) {
                await godei.delete()
                return interaction.reply({ content: "Succesfully canceled your vote!", ephemeral: true })
              } else {
                return interaction.reply({ content: "Your vote message could not be found!", ephemeral: true })
              }
            }
          } else {
            let voted = db.get(`votemsgid_${interaction.member.id}`)
            if (voted) {
              let tmestodel = await vtchat.messages.fetch(voted).catch((e) => e)
              if (tmestodel.id) {
                await tmestodel.delete()
              }
            }
            let omg = await interaction.reply(`${interaction.member.nickname} voted ${interaction.values[0]}`)
            db.set(`vote_${interaction.member.id}`, interaction.values[0])
            db.set(`votemsgid_${interaction.member.id}`, omg.id)
          }
        }
    })
}
