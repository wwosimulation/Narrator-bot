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
                    .addField("Coins", coins)
                    .addField("Roses", `Roses (Bought): ${rosesG}\nRoses: ${roses}\nBouquets: ${roseB}`)
                    .addField("Lootboxes", lootbox)

        if (custom != "None") {
            let roles = db.get(`boughtroles_${message.author.id}`) || []
            embed.addField("Custom Maker Item", `To buy roles, use \`+cmi role [role name]\`. Available Roles: <::> Villager\n<::> Pacifist\n<::> Mayor\n<::> Doctor\n<::> Seer\n<::> Avenger\n<::> Werewolf\n<::> Alpha Werewolf\n<::> Fool\n<::> Serial Killer`)
        }
    }
}