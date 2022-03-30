module.exports = {
    name: "gamepanel",
    description: "Send the game panel.",
    usage: `${process.env.PREFIX}gamepanel`,
    run: async (message, args, client) => {
        if (!client.botAdmin(message.author.id)) return

        let button1 = { type: 2, style: 3, label: "Start a Quick Game", custom_id: "gp-start", disabled: true }
        let button2 = { type: 2, style: 1, label: "Request a Full Game", custom_id: "gp-request", disabled: false }
        let button3 = { type: 2, style: 2, label: "See the Last Game's Stats", custom_id: "gp-stats", disabled: false }
        let row = { type: 1, components: [button1, button2, button3] }
        message.channel.send({
            embeds: [{ title: message.guild.name, description: "Welcome to wolvesville Simulation! Select an option below!", color: 0x9b59b6, thumbnail: { url: message.guild.iconURL({ dynamic: true }) } }],
            components: [row],
        })
    },
}
