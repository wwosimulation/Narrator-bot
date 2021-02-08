const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
    name: "inventory",
    run: async (message, args, client) => {
        if (message.channel.type != "dm") return message.channel.send("This command only works in DMs as it contains private information!")

        let lootbox = db.get(`lootbox_${message.author.id}`) || 0
        let roseG = db.get(`roseG_${message.author.id}`) || 0
        let roses = db.get(`roses_${message.author.id}`) || 0
        let roseB = db.get(`roseBouquet_${message.author.id}`) || 0
        let custom = db.get(`cmi_${message.author.id}`) || "None"
        let coins = db.get(`money_${message.author.id}`) || 0

        let embed = new Discord.MessageEmbed()
                    .setTitle("Inventory")
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription("Here is where all your good stuff are!")
                    .addField("Coins", coins + "<:coin:606434686931173377>")
                    .addField("Roses", `Roses (Bought): ${roseG}<:rosesingle:807256844191793158>\nRoses: ${roses}<:rosesingle:807256844191793158>\nBouquets: ${roseB}`)
                    .addField("Lootboxes", lootbox)

        if (custom != "None") {
            let roles = db.get(`boughtroles_${message.author.id}`) || []
            let msgroles = ""
	    let backup = "" 
	    let backup2 = "" 
            roles.forEach(e => {
		if (msgroles.length < 319 && msgroles.length > 280) {
               	     msgroles += `${client.emojis.cache.find(r => r.name === e.toLowerCase().replace(/ /g, "_"))} ${e}\n`
		} else if (msgroles.length < 1024 && msgroles.length > 985{ 
		     backup += `${client.emojis.cache.find(r => r.name === e.toLowerCase().replace(/ /g, "_"))} ${e}\n`
		} else {
		     backup2 += `${client.emojis.cache.find(r => r.name === e.toLowerCase().replace(/ /g, "_"))} ${e}\n`
		} 
            })
            embed.addField("Custom Maker Item", `To buy roles, use \`+cmi buy [role name]\`. Available Roles:\n<:villager:606429671772520468> Villager\n<:gunner:606429179914878996> Gunner\n<:doctor:606429602679881755> Doctor\n<:bodyguard:606431685885820928> Bodyguard\n<:seer:606428943960244227> Seer\n<:jailer:606429387419549696> Jailer\n<:priest:606429079880859659> Priest\n<:aura_seer:606428815027077121> Aura Seer\n<:medium:606430034684543006> Medium\n<:werewolf:606430776023580697> Werewolf\n<:alpha_werewolf:606430945062682635> Alpha Werewolf\n<:wolf_seer:606430871079223297> Wolf Seer\n<:wolf_shaman:607514754210070542> Wolf Shaman\n<:fool:606431284885192744> Fool\n<:headhunter:606431218778636298> Headhunter\n<:serial_killer:606431520953204736> Serial Killer\n${msgroles}`)
	    if (backup != "") {
           	embed.addField("\u200b", `${backup}`)
	    } 
	    if (backup2 != "") {
		embed.addField("\u200b", `${backup2}`)
	    } 
        }

	message.channel.send(embed) 
    }
}
