module.exports = {
    name: "masterpanel",
    description: "Send the master panel.",
    usage: `${process.env.PREFIX}masterpanel`,
    devOnly: true,
    run: async (message, args, client) => {
        if (!client.botAdmin(message.author.id)) return

        let button1 = { type: 2, style: 3, label: "Restart Bot", custom_id: "dev-restart", disabled: false }
        let button2 = { type: 2, style: 4, label: "Emergency Stop", custom_id: "dev-emergencystop", disabled: false }
        let button3 = { type: 2, style: 1, label: "Status", custom_id: "dev-status", disabled: false }
        let row = { type: 1, components: [button1, button2, button3] }
        message.channel.send({
            components: [row]
        })
        console.log(`${message.author.tag} used the devpanel command.`)
    }
}