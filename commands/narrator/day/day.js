const { getRole, getEmoji } = require("../../../config") // functions
const db = require("quick.db")

module.exports = {
    name: "day",
    run: async (message, args, client) => {
	
      console.log("Running day command...")      

      function sleep(milliseconds) {
	const date = Date.now();
  	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
      } 

      const dayChat = message.guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
      const werewolvesChat = message.guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object
      const aliveRole = message.guild.roles.cache.find(r => r.name === "Alive") // get the alive role - Object
      const deadRole = message.guild.roles.cache.find(r => r.name === "Dead") // get the dead role - Object
      const players = db.get(`players`) // get the players
      const alivePlayers = players.filter(player => db.get(`player_${player}`).status === "Alive")
      const deadPlayers = players.filter(player => !alivePlayers.includes(player))
      const drunks = alivePlayers.filter(p => db.get(`player_${p}`).role === "Drunk")

      console.log("Loaded all actions...")      
      
      // get all the actions
      let { wolves, beastHunterKilling } = require("./killingActions/wolves.js")
      let kittenwolf = require("./killingActions/kittenWolf.js")
      let serialkillers = require("./killingActions/serialkillers.js")
      let accomplices = require("./killingActions/accomplices.js")
      let bandits = require("./killingActions/bandits.js")
      let cannibals = require("./killingActions/cannibals.js")
      let zombies = require("./killingActions/zombies.js")
      let corruptors = require("./killingActions/corruptors.js")
      let arsonists = require("./killingActions/arsonists.js")
      let bombers = require("./killingActions/wolves.js")
      let illusionists = require("./killingActions/illusionists.js")
      let dreamcatchers = require("./killingActions/dreamcatchers.js")
      let alchemists = require("./killingActions/alchemists.js")
      let sectleaders = require("./killingActions/sectleaders.js")
      let evildetectives = require("./killingActions/evildetectives.js")
      let hackers = require("./killingActions/hackers.js")
      let prognosticators = require("./others/prognosticators.js")
      let grumpygrandmas = require("./others/grumpygrandmas.js")
      let mediums = require("./others/mediums.js")
      let forgers = require("./others/forgers.js")
      let graverobbers = require("./others/graverobbers.js")
      let channels = require("./others/channels.js")
      let redladies = require("./others/redladies.js")
      let secthunters = require("./others/secthunters.js")
      let sheriffs = require("./others/sheriffs.js")
      let spiritseers = require("./others/spiritseers.js")
      let resets = require("./others/reset.js")
      let { getCoupleTargets, couple } = require("./others/couple.js")

      console.log("Loaded all functions...")      

      console.log("Forger running...")      
      // forger doing their job
      await forgers(client)

      sleep(100);

      console.log("Prog running...")      
      // prognosticator peace doing their job
      await prognosticators(client)

      sleep(100);
      
      // red ladies doing their dirty work
      console.log("rl running...")      
      await redladies(client)

      sleep(100);
      
      // jack doing their job

      console.log("berserk running...")      
      // if berserk is activated, wolves come first
      if (db.get(`isBerserkActive`) === true) {
        await wolves(client, alivePlayers)
      }

      sleep(100);
      
      console.log("canni running...")      
      // cannibal doing their job
      await cannibals(client, alivePlayers)

      sleep(100);
      
      console.log("sk running...")      
      // serial killer doing their job
      await serialkillers(client, alivePlayers)

      sleep(100);
      
      // bandits doing their job
      console.log("bandits running...")      
      await accomplices(client, alivePlayers)
      
      sleep(100);

      // hacker doing their job
      console.log("hackers running...")      
      await hackers(client, alivePlayers)

      sleep(100);
      
      // dreamcatcher doing their job
      console.log("dc running...")      
      await dreamcatchers(client, alivePlayers)

      sleep(100);      

      // wolves doing their job last if berserk is not active
      console.log("ww running...")      
      if (db.get(`isBerserkActive`) !== true) {
        await wolves(client, alivePlayers)
      }

      sleep(100);
      
      // evil detective doing their job
      console.log("Evil det running...")      
      await evildetectives(client, alivePlayers)

      sleep(100);
      
      // bandit conversion
      console.log("Bandit conv running...")      
      await bandits(client)

      sleep(100);
      
      // bh killing a wolf
      console.log("bh running...")      
      await beastHunterKilling(client)

      sleep(100);
      
      // get couple targets
      console.log("couple running...")      
      await getCoupleTargets(client)

      sleep(100);
      
      // medium reviving
      console.log("med running...")      
      await mediums(client)

      sleep(100);

      // sect hunter hunting
      console.log("sect hunter running...")
      await secthunters(client)

      sleep(100);
      
      // sect leader converting
      console.log("sl running...")      
      await sectleaders(client)

      sleep(100);
      
      // zombies converting and biting
      console.log("zomb running...")      
      await zombies(client, alivePlayers)

      sleep(100);
      
      // grave robber getting role
      console.log("graverobber running...")      
      await graverobbers(client)

      sleep(100);
      
      // arsonist dousing
      console.log("arso running...")      
      await arsonists(client)

      sleep(100);
      
      // corruptor corrupting
      console.log("corr running...")      
      await corruptors(client)

      sleep(100);
      
      // alchemist giving potion
      console.log("alch running...")      
      await alchemists(client)

      sleep(100);
      
      // illusionist disguising
      console.log("illu running...")      
      await illusionists(client)

      sleep(100);
      
      // grumpy grandma muting
      console.log("gg running...")      
      await grumpygrandmas(client)

      sleep(100);
      
      // couple
      console.log("couple running...")      
      await couple(client)

      sleep(100);
      
      // configuring jailer and nightmare permissions
      console.log("jailer running...")      
      await channels(client)

      sleep(200);

      // give results to sheriff if any
      console.log("sheriff running...")      
      await sheriffs(client)

      // give results to spirit seer
      console.log("Spirit Seerrunning...")      
      await spiritseers(client)

      sleep(100);

      await resets(client)

      for (const drunk of drunks) {
	dayChat.permissionOverwrites.edit(drunk, { SEND_MESSAGES: false, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
      }

      if (db.get(`game.peace`) === Math.floor(db.get(`gamePhase`)/3)+1) db.delete(`game.peace`)

      db.add(`gamePhase`, 1)

      dayChat.send(`${getEmoji("day", client)} Day ${Math.floor(db.get(`gamePhase`)/3)+1} has started! Get ready to discuss!`)
      dayChat.send(`${message.guild.roles.cache.find(r => r.name === "Alive")}`)
      dayChat.permissionOverwrites.edit(aliveRole.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
      
    }
  }