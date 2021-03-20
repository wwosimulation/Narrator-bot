module.exports = {
    name: "setwin",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.guild.id == "472261911526768642") {
            if (message.member.roles.cache.has("606139219395608603") || message.member.roles.cache.has("606276949689499648")) {
                    require("quick.db").set(`winner`, args.join(' '))
                    message.channel.send("Done!")
                    require("quick.db").set(`isDay_${message.guild.id}`, "yes")
                    require("quick.db").set(`isNight_${message.guild.id}`, "yes")
                    require("quick.db").set(`commandEnabled_${message.guild.id}`, "yes")
            }
        }
    }
}
