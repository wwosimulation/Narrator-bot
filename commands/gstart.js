const db = require("quick.db")
const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
	name: "gstart",
	run: async (message, args, client) => {
		
		let gwa = client.channels.cache.get("606123798369927168")
		if (gwa.permissionsFor(message.member).has(["SEND_MESSAGES"])) {
			if (args.length < 2) return message.channel.send("You need at least 2 arguments. One for the time and the prize. Optionally you can insert the winner amount. The default winner amount is 1.")
			let winners = 1
			let timeneeded = ms(args[0])
			if (!timeneeded) return message.channel.send("Invalid time format!")
			if (parseInt(args[1])) {
				winners = args[1]
			}
			let thea = args
		}
		
	}
}
