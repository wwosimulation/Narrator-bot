const Discord = require("discord.js")

const {shop, emojis, fn} = require("../../config.js")

module.exports = {
  name: "shop",
  run: async (message, args, client) => {
    let embeds = [new Discord.MessageEmbed().setTitle("Wolvesville Simulation Store").setColor("#1FFF43")]
    let addFooter = false

    if (["color", "colors", "colour", "colours"].includes(args[0])) {
      embeds[0].setDescription("Available colors:\n\n")
      shop.colors.forEach((x) => {
        embeds[0].description += `${x.name} Color\n`
      })
      embeds[0].description += `\nUse \`+buy <color> role\` to purchase a color`
    } else if (false) {
    } else {
      for (let shopitem in shop.items) {
        let item = shop.items[shopitem]
        if (embeds[embeds.length - 1].fields.length == 5) embeds.push(new Discord.MessageEmbed())
        embeds[embeds.length - 1].addField(`${item.name} - ${item.price} ${emojis[item.currency]}`, item.description)
      }
      addFooter = true
    }

    for (let [i, embed] of embeds.entries()) {
      if(addFooter == true) embed.setFooter(`Page ${i + 1}/${embeds.length}`)
      embed.setTitle("Wolvesville Simulation Store")
        .setColor("#1FFF43")
    }

    let m = await message.inlineReply(embeds[0])
    client.paginator(message.author.id, m, embeds, 0)

    // if (!args[0] || args[0] == '1') {
    //     message.channel.send(new Discord.MessageEmbed()
    //     .setTitle("Wolvesville Simulation Store")
    //     .setColor("#1FFF43")
    //     .setAuthor(message.author.tag, message.author.avatarURL())
    //     .setFooter("Page [1/2]")
    //     .setDescription(`Your Balance: **${db.get(`money_${message.author.id}`)}<:coin:606434686931173377>**\n\n === Shop Items ===\n\n**Roses (Single) - 25<:coin:606434686931173377>**\nBuy some rose to trade with other people and buy interesting items!\n\n**Red Colour - 50<:coin:606434686931173377>**\nSassy red makes you look uh... well sassy!\n\n**Blue Colour - 50<:coin:606434686931173377>**\nBlue, as calm as the sky. Get lost, you aren't even near to calm.\n\n**Green Colour - 50<:coin:606434686931173377>**\nBuy this or suffer for eternity.\n\n**Yellow Colour - 50<:coin:606434686931173377>**\nEww, what a dirty colour. Unless you're a f\\*\\*\\*boy or dirty, just do us a favour and don't buy this.\n\n**Black Colour - 50<:coin:606434686931173377>**\nYes, black. Like everyone's heart. In a space vacuum. Where no one can exist.\n\n**Salmon Colour - 50<:coin:606434686931173377>**\nYummy Salmon. Buy this so i can buy a salmon for myself!\n\n**Pink Colour - 50<:coin:606434686931173377>**\nBy buying this colour, you agree that you are too girly and watch "My Little Pony"\n\n**Turquoise Colour - 50<:coin:606434686931173377>**\nSince this is an another version of green, buy or die!\n\n**Crimson Colour - 50<:coin:606434686931173377>**\nWhat the heck is even a crimson...\n\n`)
    //     )
    // } else if (args[0] == "2") {

    //     message.channel.send(
    //         new Discord.MessageEmbed()
    //         .setTitle("Wolvesville Simulation Store")
    //         .setColor("#1FFF43")
    //         .setFooter("Page [2/2]")
    //         .setAuthor(message.author.tag, message.author.avatarURL())
    //         .setDescription(`Your Balance: **${db.get(`money_${message.author.id}`)}<:coin:606434686931173377>**\n\n === Shop Items ===\n\n**Premium Lootboxes - 100<:coin:606434686931173377>**\nYou just don't have a real life and this proves that you are too desperate to buy this so you can pass time gaining repeated role.\n\n**Elite lootboxes - 150<:coin:606434686931173377>**\nSame thing like above but even worse.\n\n**Profile command - 200<:coin:606434686931173377>**\nLol, I'm sure you wanna buy me.\n\n**Roses (Bouquet) - 250<:coin:606434686931173377>**\nBuy these and everyone gets a rose! Yes, including yourself!\n\n**DJ Role - 450<:coin:606434686931173377>**\nYou can use this role to play your own songs in the game server!\n\n**Special Role - 500<:coin:606434686931173377>**\nFinally, have the role name and colour as your type goofbag.\n\n**Emoji - 500<:coin:606434686931173377>**\nGrants access to -write\n\n**Immunity - 500<:coin:606434686931173377>**\nWhen spectating, it will not change your name to lazy spectatorz\n\n**Gray Role - 1000<:coin:606434686931173377>**\nYou all will pay literally anything for this.\n\n**Ranked Pass - 1250<:coin:606434686931173377>**\nYou can use this to play ranked games!\n\n**Custom Maker Item - 1500<:coin:606434686931173377>**\nYou can use this to create your own role list when playing.\n\nThis does not give you the full set of role list. You need to buy more roles using coins or roses to access it! To check the list, do \`+cmi\`.\n\n**Private Channel - 2500<:coin:606434686931173377>**\nYou can create your own private channel in this server!`)
    //     )

    // }
  },
}
