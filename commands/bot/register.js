const { messageEmbed } = require("discord.js")
const players = require("../../schemas/players")
const { ids } = require("../../config")

module.exports = {
    name: "register",
    description: "Register your invite link to be able to get the Invite badge.",
    usage: `${process.env.PREFIX}register [invite]`,
    run: async (message, args, client) => {
        let code = ""
        let sim = client.guilds.cache.get(ids.server.sim)
        let status = ""
        let response = new messageEmbed().setThumbnail(message.author.avatarURL()).setTimestamp().setFooter(`Want to check which invite you registered? Use ${process.env.PREFIX}register`)

        if(!args[0]) {
            let guy = await players.findOne({user: message.author.id})
            if(guy.badges.invite.code && guy.badges.invite.code !== "none") {
                response.setColor("GREEN").setDescription(`You current registered invite code is \`${guy.badges.invite.code}\``)
            }
            else {
                response.setColor("RED").setDescription(`You don't have any invite registered yet. Register it now using \`${this.usage}\`!\n\nThe invite can be in any of these formats:\n\`https://discord.gg/wmY5afT\`,\n\`discord.gg/wmY5afT\`,\n\`wmY5afT\``)
            }
            return message.channel.send({embeds:[response]})
        }

        if(args[0].startsWith("https://discord.gg/" || arsg[0].startsWith("discord.gg/"))) code = args[0].split("discord.gg/")[1]
        else code = args[0]
            
        if(sim.invites.cache.has(code)) {
            if(!sim.invites.cache.get(code).inviter.id === message.author.id) status = "not own"
            else status = "valid"
        }
        else {
            status = "not sim"
        }
        


        switch (status) {
            case "valid":
                await players.findOneAndUpdate({user: message.author.id}, {$set:{"badges.invite.code": code}}, {upsert: true})
                response.setColor("GREEN").setDescription(`Successfully registered \`${code}\` to your account!`).setTitle("Successfully added invite")
            case "not own":
                response.setColor("RED").setDescription("Please use an invite you created!").setTitle("Failed to add invite")
            case "not sim":
                response.setColor("RED").setDescription(`Unable to find invite \`${code}\`!\nPlease use an invite from the sim server.`).setTitle("Failed to add invite")
            default:
                response.setColor("RED").setDescription("Can't resolve this invite. Please try again or report this bug.").setTitle("Failed to add invite")
        }
        return message.channel.send({embeds:[response]})
    }
}
