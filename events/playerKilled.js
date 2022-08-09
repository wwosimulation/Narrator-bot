const db = require("quick.db")
const { getEmoji, getRole } = require("../config")

function getPhase() {
    const gamePhase = db.get(`gamePhase`)
    const voting = db.get(`commandEnabled`)
    let time = gamePhase % 3 === 0 ? "night" : voting === true ? "voting" : "day"
    let date = Math.floor(gamePhase / 3) + 1
    return { during: time, on: date }
}

module.exports = async (client) => {
    
    client.on("playerKilled", async (guy, attacker) => {
        
        const phase = getPhase()
	const guild = client.guilds.cache.get("890234659965898813")
	const dayChat = guild.channels.cache.find(c => c.name === "day-chat")
	const players = db.get(`players`) || []
	const doppelgangers = players.filter(p => db.get(`player_${p}`).role === "Doppelganger" && db.get(`player_${p}`).status === "Alive")
	const redladies = players.filter(p => db.get(`player_${p}`).role === "Red Lady" && db.get(`player_${p}`).status === "Alive")
	const narrator = guild.roles.cache.find(r => r.name === "Narrator")
	const mininarr = guild.roles.cache.find(r => r.name === "Narrator Trainee")

	guild.members.fetch(guy.id).then(a => {
	    if (a.roles.cache.has("892046205780131891")) a.roles.remove("892046205780131891")
	})

        db.set(`player_${guy.id}.killedBy`, typeof attacker === "string" ? attacker : attacker.id)
        db.set(`player_${guy.id}.killedDuring`, phase.during)
        db.set(`player_${guy.id}.killedOn`, phase.on)

	db.delete(`player_${guy.id}.corrupted`)
	db.delete(`player_${guy.id}.poisoned`)

	if (guy.role === "Sect Leader") {

	    let members = guy.sectMembers?.filter(p => db.get(`player_${p}`).status === "Alive") || []
	    members.forEach(async p => {
		let player = db.get(`player_${p}`)
		let member = await guild.members.fetch(player.id)
		let memberRoles = member.roles.cache.map(a => a.name === "Alive" ? "892046207428476989" : a.id)
		db.set(`player_${p}.status`, "Dead")
		await dayChat.send(`${getEmoji("sect_member", client)} Sect member **${players.indexOf(player.id)+1} ${player.username} (${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role})** fled the village!`)
		await member.roles.set(memberRoles)
		client.emit("playerKilled", player, guy)
	    })

	}

	if (guy.role === "Mad Scientist") {

	    let alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive" || p === guy.id)
	    let player1 = alivePlayers[alivePlayers.indexOf(guy.id)-1] || alivePlayers[alivePlayers.length-1]
	    let player2 = alivePlayers[alivePlayers.indexOf(guy.id)+1] || alivePlayers[0]

	    if (player1 === player2) {
		let member = await guild.members.fetch(player1)
    		let memberRoles = member.roles.cache.map(a => a.name === "Alive" ? "892046207428476989" : a.id)
		db.set(`player_${player1}.status`, "Dead")
		await dayChat.send(`${getEmoji("toxic", client)} The Mad Scientist released a toxic gas and killed **${players.indexOf(player1)+1} ${db.get(`player_${player1}`).username} (${getEmoji(db.get(`player_${player1}`).role.toLowerCase().replace(/\s/g, "_"), client)} ${db.get(`player_${player1}`).role})**!`)
		await member.roles.set(memberRoles)
		client.emit("playerKilled", player1, guy)
	    } else {
		let member1 = await guild.members.fetch(player1)
    		let memberRoles1 = member1.roles.cache.map(a => a.name === "Alive" ? "892046207428476989" : a.id)
		db.set(`player_${player1}.status`, "Dead")
		await dayChat.send(`${getEmoji("toxic", client)} The Mad Scientist released a toxic gas and killed **${players.indexOf(player1)+1} ${db.get(`player_${player1}`).username} (${getEmoji(db.get(`player_${player1}`).role.toLowerCase().replace(/\s/g, "_"), client)} ${db.get(`player_${player1}`).role})**!`)
		await member1.roles.set(memberRoles)
		client.emit("playerKilled", player1, guy)
		let member2 = await guild.members.fetch(player1)
    		let memberRoles2 = member2.roles.cache.map(a => a.name === "Alive" ? "892046207428476989" : a.id)
		db.set(`player_${player2}.status`, "Dead")
		await dayChat.send(`${getEmoji("toxic", client)} The Mad Scientist released a toxic gas and killed **${players.indexOf(player2)+1} ${db.get(`player_${player2}`).username} (${getEmoji(db.get(`player_${player2}`).role.toLowerCase().replace(/\s/g, "_"), client)} ${db.get(`player_${player2}`).role})**!`)
		await member2.roles.set(memberRole2)
		client.emit("playerKilled", player2, guy)
	    }

	}

	if (guy.role === "Loudmouth") {

	    if (guy.target) {
		let player = db.get(`player_${guy.target}`) || { status: "Dead" }
		if (player.status === "Alive") {	
		    let member = await guild.members.fetch(player.id)		    
	            await dayChat.send(`${getEmoji("loudmouthed", client)} The Loudmouth's last will was to reveal **${players.indexOf(player.id)+1} ${player.username} (${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role})**.`)
		}
	    }
	}

	if (["Avenger", "Junior Werewolf"].includes(guy.role)) {
	
	    if (guy.target) {
		let player = db.get(`player_${guy.target}`) || { status: "Dead" }
		if (player.status === "Alive") {
		    let member = await guild.members.fetch(player.id)
    		    let memberRoles = member.roles.cache.map(a => a.name === "Alive" ? "892046207428476989" : a.id)
		    db.set(`player_${guy.target}.status`, "Dead")
		    await dayChat.send(`${getEmoji((guy.role === "Avenger" ? "avenge" : "jwwtag"), client)} ${guy.role === "Avenger" ? "The Avenger avenged" : `The Junior Werewolf's death has been avenged!`} **${players.indexOf(player.id)+1} ${player.username} (${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role})** ${guy.role === "Avenger" ? "" : " is dead"}!`)
		    await member.roles.set(memberRoles)
		    client.emit("playerKilled", player, guy)		    
		}
	    }
	
	}

	if (guy.couple) {
	    let player = db.get(`player_${guy.couple}`) || { status: "Dead" }

	    if (player.status === "Alive") {
		let member = await guild.members.fetch(player.id)
    		let memberRoles = member.roles.cache.map(a => a.name === "Alive" ? "892046207428476989" : a.id)
		db.set(`player_${guy.couple}.status`, "Dead")
		await dayChat.send(`${getEmoji("couple", client)} Player **${players.indexOf(player.id)+1} ${player.username} (${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role})** lost the love of their life and fled the village!`)
		await member.roles.set(memberRoles)
		client.emit("playerKilled", player, guy)		    
	    }
	}

	if (guy.binded) {
	    let player = db.get(`player_${guy.binded}`) || { status: "Dead" }

	    if (player.status === "Alive") {
		let member = await guild.members.fetch(player.id)
    		let memberRoles = member.roles.cache.map(a => a.name === "Alive" ? "892046207428476989" : a.id)
		db.set(`player_${guy.binded}.status`, "Dead")
		await dayChat.send(`${getEmoji("binded", client)} Player **${players.indexOf(player.id)+1} ${player.username} (${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role})** died as well as they were binded with another player!`)
		await member.roles.set(memberRoles)
		client.emit("playerKilled", player, guy)		    
	    }
	}

	if (guy.role === "Kitten Wolf") {
	    require("../commands/narrator/day/killingActions/wolves.js").triggerKittenWolf(client)
	}

	// doppelgangers
	for (const doppel of doppelgangers) {
	    
  	    let player = db.get(`player_${doppel}`) || { status: "Dead" }
	    let target = db.get(`player_${player.target}`)

	    if (player.target === guy.id) {
		db.delete(`player_${doppel}.target`)
		Object.entries(target).forEach(entry => {
		    if (!["username", "id", "status", "channel", "allRoles", "target", "corrupted", "sected", "bitten", "couple", "poisoned", "hypnotized", "disguised", "shamanned", "binded"].includes(entry[0])) {
	            	db.set(`player_${doppel}.${entry[0]}`, entry[1])
      	 	    }
		})

		let channel = guild.channels.cache.get(player.channel)

		// create the channel
		const newChannel = await guild.channels.create(`priv-${target.role.toLowerCase().replace(/\s/g, "-")}`, { 
	            parent: "892046231516368906", // the category id
	            position: channel.rawPosition // the same position where the channel is
		})

    		// give permissions to the grave robber
    		await newChannel.permissionOverwrites.create(doppel, {
	            SEND_MESSAGES: true,
        	    VIEW_CHANNEL: true,
	            READ_MESSAGE_HISTORY: true
		})

	    	// disable permissions for the everyone role
    		await newChannel.permissionOverwrites.create(guild.id, {
	    	    VIEW_CHANNEL: false,
	    	})

	    	// give permissions to narrator
	    	await newChannel.permissionOverwrites.create(narrator.id, {
    		    SEND_MESSAGES: true,
    		    VIEW_CHANNEL: true,
    		    READ_MESSAGE_HISTORY: true,
      		    MANAGE_CHANNELS: true,
	            MENTION_EVERYONE: true,
	            ATTACH_FILES: true,
	    	})

    		// give permissions to narrator trainee
    		await newChannel.permissionOverwrites.create(mininarr.id, {
            	    SEND_MESSAGES: true,
	            VIEW_CHANNEL: true,
	            READ_MESSAGE_HISTORY: true,
	            MANAGE_CHANNELS: true,
	            MENTION_EVERYONE: true,
	            ATTACH_FILES: true,
	        })
    
    		await channel.delete() // delete the old channel
    
    		await newChannel.send(getRole(target.role.toLowerCase().replace(/\s/g, "-")).description)
	       .then(async c => { await c.pin() ; await c.channel.bulkDelete(1) }) // sends the description, pins the message and deletes the last message
	    	await newChannel.send(`<@${doppel}>`)
    		.then(c => setTimeout(() => c.delete(), 3000)) // pings the player and deletes the ping after 3 seconds
    
    		if (target.team === "Werewolf") {
      
      		    // give perms to the werewolves' chat 
		    const wolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat")
  		    await wolvesChat.send(`${getEmoji("werewolf", client)} Player **${players.indexOf(player.id)+1} ${player.username} (${getEmoji("doppelganger", client)} Doppelganger)** was a doppelganger that now took over the role of **${players.indexOf(target.id)+1} ${target.username} (${getEmoji(target.role?.toLowerCase().replace(/\s/g, "_"))} ${target.role})**! Welcome them to your team.`) // send a message
  		    await wolvesChat.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
		    if (phase.during === "night") wolvesChat.permissionOverwrites.edit(player.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
    
	        } else if (target.role === "Zombie") {

		    // give perms to zombies chat
		    const zombChat = guild.channels.cache.find(c => c.name === "zombies-chat")
  		    await zombChat.send(`${getEmoji("zombie", client)} Player **${players.indexOf(player.id)+1} ${player.username} (${getEmoji("doppelganger", client)} Doppelganger)** was a doppelganger that now took over the role of **${players.indexOf(target.id)+1} ${target.username} (${getEmoji("zombie", client)} Zombie)**! Welcome them to your team.`) // send a message
  		    await zombChat.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
		    if (phase.during === "night") zombChat.permissionOverwrites.edit(player.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })

		} else if (target.role === "Sect Leader") {
		
		    // give perms to sect chat
		    const sectChat = guild.channels.cache.get(target.sectChannel)
  		    await sectChat.send(`${getEmoji("sect_leader", client)} Player **${players.indexOf(player.id)+1} ${player.username} (${getEmoji("doppelganger", client)} Doppelganger)** was a doppelganger that now took over the role of **${players.indexOf(target.id)+1} ${target.username} (${getEmoji("sect_leader", client)} Sect Leader)**! Welcome them to your team.`) // send a message
  		    await sectChat.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
		    if (phase.during === "night") sectChat.permissionOverwrites.edit(player.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
			
		} else if (target.role === "Sibling") {

		    // give perms to sibling chat
		    const sibChat = guild.channels.cache.find(c => c.name === "siblings-chat")
  		    await sibChat.send(`${getEmoji("sibling", client)} Player **${players.indexOf(player.id)+1} ${player.username} (${getEmoji("doppelganger", client)} Doppelganger)** was a doppelganger that now took over the role of **${players.indexOf(target.id)+1} ${target.username} (${getEmoji("sibling", client)} Sibling)**! Welcome them to your team.`) // send a message
  		    await sibChat.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
		    if (phase.during === "night") sibChat.permissionOverwrites.edit(player.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })

		} else if (["Bandit", "Accomplice"].includes(player.role)) {
			
		    // give perms to zombies chat
		    const banditChat = guild.channels.cache.get(target.banditChannel)
  		    await banditChat.send(`${getEmoji("zombie", client)} Player **${players.indexOf(player.id)+1} ${player.username} (${getEmoji("doppelganger", client)} Doppelganger)** was a doppelganger that now took over the role of **${players.indexOf(target.id)+1} ${target.username} (${getEmoji(target.role.toLowerCase(), client)} target.role)**! Welcome them to your team.`) // send a message
  		    await banditChat.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
		    if (phase.during === "night") sectChat.permissionOverwrites.edit(player.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })

		}
	    }

	}

	// red ladies
	for (const redlady of redladies) {
	    let player = db.get(`player_${redlady}`)
	    if (player.status !== "Alive") continue;
	    console.log("rl is alive")
	    if (player.target !== guy.id) continue;
	    console.log("rl's target is ded")
	    if (guy.killedDuring !== "night") continue;
	    db.set(`player_${redlady}.status`, "Dead");
	    db.delete(`player_${redlady}.target`);
	    let member = await guild.members.fetch(redlady)
	    await member.roles.set(member.roles.cache.map(r => r.name === "Alive" ? "892046207428476989" : r.id))
	    await dayChat.send(`${getEmoji("visit", client)} Player **${players.indexOf(redlady)+1} ${player.username} (${getEmoji("red_lady", client)} Red Lady)** visited a player who was attacked and died!`)
	    client.emit("playerKilled", db.get(`player_${member.id}`), db.get(`player_${member.id}`))
	}
	

    })

}