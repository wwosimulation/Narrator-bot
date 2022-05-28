module.exports = {
    name: "night",
    run: async (message, args, client) => {
      
      const dayChat = message.guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
      const werewolvesChat = message.guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object
      const aliveRole = message.guild.roles.cache.find(r => r.name === "Alive") // get the alive role - Object
      const deadRole = message.guild.roles.cache.find(r => r.name === "Dead") // get the dead role - Object
      const players = db.get(`players`) // get the players
      const alivePlayers = players.filter(player => db.get(`player_${player}`).status === "Alive")
      const deadPlayers = players.filter(player => !alivePlayers.includes(player))
      
      // get all the actions
      const lynch = require("./kills/lynch.js")
      const alchemists = require("./kills/alchemists.js")
      const bombers = require("./kills/bombers.js")
      const corruptors = require("./kills/corruptors.js")
      const zombies = require("./kills/zombies.js")
      const toughGuy = require("./kills/toughGuy.js")
      const actions = require("./others/actions.js")
      const channels = require("./others/channels.js")
      const dreamcatchers = require("./others/dreamcatcher.js")
      const jailers = require("./others/jailers.js")
      const naughtyboys = require("./others/naughtyboys.js")
      const nightmarewolves = require("./others/nightmarewolf.js")
      
      await lynch(client)
      
      await corruptors(client)
      
      await alchemists(client)
      
      await zombies(client)
      
      await toughGuy(client)
      
      await naughtyboys(client)
      
      await jailers(client)
      
      await dreamcatchers(client)
      
      await nightmarewolves(client)
      
      await channels(client)
      
      await actions(client)
      
      await bombers(client)
    }
  
  }