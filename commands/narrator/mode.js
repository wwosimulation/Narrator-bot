const { gameModes } = require("../../config")

module.exports = {
    name: "mode",
    description: "Pings the alive role and asks which gamemode to play.\nAdd gamemodes as desired by adding to the end of this command.",
    usage: `${process.env.PREFIX}mode [more gamemodes]`,
    gameOnly: true,
    narratorOnly: true,
    aliases: ["csr", "cs", "gamemode"],
    run: async (message, args, client) => {
        let modesSent = [...gameModes]
        args.forEach((match) => {
            modesSent.push(match.charAt(0).toUpperCase() + match.slice(1))
        })
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let voteChat = message.guild.channels.cache.find((x) => x.name == "vote-chat")
        let droppy = { type: 3, custom_id: "votemode", options: [] }
        modesSent.forEach((x) => {
            droppy.options.push({ label: `${x}`, value: `${x}` })
        })
        let row = { type: 1, components: [droppy] }
        let m = await voteChat.send({ content: `${alive}, which game mode should we play?`, components: [row] })
    },
}
