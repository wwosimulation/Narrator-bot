const Chart = require('chart.js')
const { ids, fn, getEmoji } = require("../../config")
const { stats } = require("../../db.js")
const ms = require("ms")
const discord = require("discord.js")

module.exports = {
    command: {
        name: "chart",
        description: "view a chart of collected data",
        options: [
          {
            type: "STRING",
            name: "reason",
            description: "Reason for deleting this warning.",
          },
        ],
    },
    run: async (interaction, client) => {
      let type = interaction.options.getString("type")
      
      let stat = await stats.find()
      stat = stat[0]
      
      let dates = []
      let collectedData = []
      stat.games.forEach(game => {
        dates.push(new Date(game[Object.keys(game)].time))
      })
      dates.sort((date1, date2) => date1 - date2)
      dates.forEach(date => {
        if (collectedData.length != 31) {
          let found = collectedData.find(e => Object.keys(e).slice(8, 10) == date.slice(8, 10))
          if (found) {
            collectedData[collectedData.indexOf(found)] = { [date]: Object.values + 1 }
          } else {
            collectedData.push({[date]: 1})
          }
        }
      })
      console.log(collectedData)
      
     console.log(dates)
     interaction.reply('hi')
    },
}