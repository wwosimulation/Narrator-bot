const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
    name: "shop",
    run: async (message, args, client) => {
        if (message.author.id != "552814709963751425") return message.channel.send("Yes trying to get leaks from me huh?")
        if (message.guild.id != '465795320526274561') return
        if (!args[0] || args[0] == '1') {
            message.channel.send(new Discord.MessageEmbed()
            .setTitle("Werewolf Online Simulation Store")
            .setColor("#1FFF43")
            .addField("DJ Role - 450 coins", "You can use this role to play your own songs in the game server!")
            .addField("Red Colour - 50 coins", "Sassy red makes you look uh... well sassy!")
            .addField("Blue Colour - 50 coins", "Blue, as calm as the sky. Get lost, you aren't even near to calm.")
            .addField("Green Colour - 50 coins", "Buy this or suffer for eternity.")
            .addField("Yellow Colour - 50 coins", "Eww, what a dirty colour. Unless you're a f\*\*\*boy or dirty, just do us a favour and don't buy this.")
            .addField("Black Colour - 50 coins", "Yes, black. Like everyone's heart. In a space vacuum. Where no one can exist.")
            .addField("Salmon Colour - 50 coins", "Yummy Salmon. Buy this so i can buy a salmon for myself!")
            .addField("Pink Colour - 50 coins", "By buying this colour, you agree that you are too girly and watch \"My Little Pony\"")
            .addField("Turquoise Colour - 50 coins", "Since this is an another version of green, buy or die!")
            .addField("Crimson Colour - 50 coins", "What the heck is even a crimson...")
            .addField("Special Role - 500 coins", "Finally, have the role name and colour as your type goofbag.")
            .addField("Premium Lootboxes - 50 coins", "You just don't have a real life and this proves that you are too desperate to buy this so you can pass time gaining repeated role.")
            .addField("Elite lootboxes - 50 coins", "Same thing like above but even worse.")
            .addField("Custom Maker Item - 1500 coins", "You can use this to create your own role list when playing.\n\nThis does not give you the full set of role list. You need to buy more roles using coins or roses to access it! To check the list, do `+command that will be announced soon`.")
            .addField("Private Channel - 2500 Coins", "You can create your own private channel in this server!")
            .addField("Emoji - 500 Coins", "Grants access to -write")
            .addField("Immunity - 500 Coins", "When spectating, it will not change your name to lazy spectatorz")
            .addField("Roses (Single) - 25 coins", "Buy some rose to trade with other people and buy interesting items!")
            .addField("Roses (Bouquet) - 250 coins", "Buy these and everyone gets a rose! Yes, including yourself!")
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setDescription(`Your Balance: ${db.get(`money_${message.author.id}`)}`)
            )
        }
    }
}
