const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "botinfo",
    run: async (message, args, client) => {
        let embed = new MessageEmbed()
            .setTitle(client.user.tag)
            .setDescription(
                `Narrator Bot is a bot designed specifically for the [Wolvesville Simulation](https://wovsimulation.xyz) server.
Narrator Bot's main purpose is to automate much of what happens when we run a game of Wolvesville here in Discord. It also runs the server economy and much of the more labor-intensive tasks in the server.

This bot was started in October of 2020 by Ashish who designed much of the core game functionality, and was transfered in March of 2021 to Shadow, who created the economy and completed the bot to release a couple months later.





`
            )
            .addField(
                "**__Credits:__**",
                `
Lead Developer: <@439223656200273932>
Originally created by: Ashish#0540
Beta Testers: <@!159717599993790464> <@!719564153072910407> <@!801726595378315264> <@!406412325973786624> <@!620964363729371137> <@!452632560795648000>
Economy Designers: <@!801726595378315264> <@!406412325973786624>

__Special thanks to the following:__
<@!719564153072910407> for helping with many testing games, bug finding, organizing suggestions, and testing everything
<@!620964363729371137> for organizing basically everything about the bot and GitHub, starting the bug tracker, keeping everything neat

Thank you to all the Staff who come up with new ideas for the bot, and to everyone who has joined a Testes Gae or a Beta Testes game

`
            )
        message.channel.send({ embeds: [embed] })
    },
}
