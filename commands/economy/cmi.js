const { MessageEmbed } = require("discord.js")
const { cmi, emojis } = require("../../config")

module.exports = {
    name: "cmi",
    description: `Get a list of game roles available to buy or buy them using the subcommand \`${process.env.PREFIX}cmi buy <role>\``,
    usage: `${process.env.PREFIX}cmi [buy <role>]`,
    run: async (message, args, client) => {
        return
        //if (message.channel.type != "dm") return message.channel.send("Please try this command in DMs!")

        let msg = ""
        let boughtroles = db.get(`boughtroles_${message.author.id}`) || []

        let embeds = []
        let addFooter = false

        for (let roleitem in cmi) {
            let role = cmi[roleitem]
            embeds.push(new MessageEmbed())
            embeds[embeds.length - 1].addField(`${role.name}`, `${role.price} ${emojis[role.currency]}`)
        }
        addFooter = true

        for (let [i, embed] of embeds.entries()) {
            if (addFooter == true) embed.setFooter({text: `Page ${i + 1}/${embeds.length}`})
            embed.setTitle("CMI Store").setColor("#1FFF43")
        }

        let m = await message.reply({ embeds: [embeds[0]] })
        client.paginator(message.author.id, m, embeds, 0)

        // if (boughtroles.length > 0) {
        //   boughtroles.forEach((e) => {
        //     allroles.splice(allroles.indexOf(e), 1)
        //     if (roses25.indexOf(e) != -1) {
        //       roses25.splice(roses25.indexOf(e), 1)
        //     }
        //     if (roses50.indexOf(e) != -1) {
        //       roses50.splice(roses50.indexOf(e), 1)
        //     }
        //     if (coins75.indexOf(e) != -1) {
        //       coins75.splice(coins75.indexOf(e), 1)
        //     }
        //     if (coins250.indexOf(e) != -1) {
        //       coins250.splice(coins250.indexOf(e), 1)
        //     }
        //     if (coins1000.indexOf(e) != -1) {
        //       coins1000.splice(coins1000.indexOf(e), 1)
        //     }
        //   })
        // }
        // let ehek = ""
        // roses25.forEach((e) => {
        //   if (e == "Grave Robber") {
        //     ehek += `~~${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 25<:rosesingle:807256844191793158>~~\n`
        //     msg += `~~${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 25<:rosesingle:807256844191793158>~~\n`
        //   } else {
        //     ehek += `${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 25<:rosesingle:807256844191793158>\n`
        //     msg += `${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 25<:rosesingle:807256844191793158>\n`
        //   }
        // })
        // roses50.forEach((e) => {
        //   ehek += `${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 50<:rosesingle:807256844191793158>\n`
        //   msg += `${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 50<:rosesingle:807256844191793158>\n`
        // })
        // coins75.forEach((e) => {
        //   ehek += `${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 75<:coin:606434686931173377>\n`
        //   if (args.length == 0 && ehek.length > 1980) {
        //     message.channel.send(
        //       new MessageEmbed()
        //         .setTitle("Roles to buy:")
        //         .setDescription(msg)
        //         .setColor("#008800")
        //     )
        //     msg = ""
        //     ehek = ""
        //   }
        //   msg += `${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 75<:coin:606434686931173377>\n`
        // })
        // coins250.forEach((e) => {
        //   ehek += `${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 75<:coin:606434686931173377>\n`
        //   if (args.length == 0 && ehek.length > 1980) {
        //     message.channel.send(
        //       new MessageEmbed()
        //         .setTitle("Roles to buy:")
        //         .setDescription(msg)
        //         .setColor("#008800")
        //     )
        //     msg = ""
        //     ehek = ""
        //   }
        //   msg += `${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(/ /g, "_"))} ${e} - 250<:coin:606434686931173377>\n`
        // })
        // coins1000.forEach((e) => {
        //   ehek += `${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 1000<:coin:606434686931173377>\n`
        //   if (args.length == 0 && ehek.length > 1980) {
        //     message.channel.send(
        //       new MessageEmbed()
        //         .setTitle("Roles to buy:")
        //         .setDescription(msg)
        //         .setColor("#008800")
        //     )
        //     ehek = ""
        //     msg = ""
        //   }
        //   msg += `${client.emojis.cache.find((x) => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 1000<:coin:606434686931173377>\n`
        // })

        // if (msg == "") msg = "None"

        // if (args.length == 0) {
        //   message.channel.send(
        //     new MessageEmbed()
        //       .setTitle("Roles to buy:")
        //       .setDescription(msg)
        //       .setColor("#008800")
        //   )
        // } else if (args[0] == "buy") {
        //   let hasCMI = db.get(`cmi_${message.author.id}`)
        //   console.log(hasCMI, message.author.id)
        //   if (!hasCMI) return message.channel.send("You need to buy the Custom Maker Item before you can buy the other roles!")

        //   let totalag = ""
        //   for (let i = 1; i < args.length; i++) {
        //     if (i == args.length - 1) {
        //       totalag += args[i][0].toUpperCase() + args[i].slice(1).toLowerCase()
        //     } else {
        //       totalag += args[i][0].toUpperCase() + args[i].slice(1).toLowerCase() + " "
        //     }
        //   }

        //   if (!allroles.includes(totalag)) return message.channel.send("Role not found!")
        //   if (boughtroles.includes(totalag)) return message.channel.send("You already bought this role!")
        //   if (totalag == "Grave Robber") return message.channel.send("This role is currently not available!")
        //   let money = db.get(`money_${message.author.id}`)
        //   let roses = db.get(`roses_${message.author.id}`) || 0
        //   if (roses25.includes(totalag)) {
        //     if (roses < 25) return message.channel.send("You do not have enough roses to buy this role!")
        //     db.subtract(`roses_${message.author.id}`, 25)
        //   } else if (roses50.includes(totalag)) {
        //     if (roses < 50) return message.channel.send("You do not have enough roses to buy this role!")
        //     db.subtract(`roses_${message.author.id}`, 50)
        //     boughtroles.push(totalag)
        //     db.set(`boughtroles_${message.author.id}`, boughtroles)
        //   } else if (coins75.includes(totalag)) {
        //     if (money < 75) return message.channel.send("You do not have enough gold to buy this role!")
        //     db.subtract(`money_${message.author.id}`, 75)
        //     boughtroles.push(totalag)
        //     db.set(`boughtroles_${message.author.id}`, boughtroles)
        //   } else if (coins250.includes(totalag)) {
        //     if (money < 250) return message.channel.send("You do not have enough gold to buy this role!")
        //     db.subtract(`money_${message.author.id}`, 250)
        //     boughtroles.push(totalag)
        //     db.set(`boughtroles_${message.author.id}`, boughtroles)
        //   } else if (coins1000.includes(totalag)) {
        //     if (money < 1000) return message.channel.send("You do not have enough gold to buy this role!")
        //     db.subtract(`money_${message.author.id}`, 1000)
        //     boughtroles.push(totalag)
        //     db.set(`boughtroles_${message.author.id}`, boughtroles)
        //   } else {
        //     return message.channel.send("Role not found!")
        //   }
        // }
    },
}
