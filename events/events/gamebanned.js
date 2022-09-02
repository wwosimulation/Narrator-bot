const { unix } = require("moment")
const { ids } = require("../config")
const gamewarns = require("../schemas/gamewarns")

module.exports = (client) => {
    client.on("gamebanned", async (user) => {
        let guy = client.guilds.cache.get(ids.server.sim).members.cache.get(user.id)
        let warns = await gamewarns.find({ user: guy.id, date: { $gt: (new Date().getTime() - 7889400000).toFixed() } })
        if (warns.length >= 5 && !guy.roles.cache.has(ids.gamebanned)) {
            guy.roles.add(ids.gamebanned)
            guy.user.send({ content: `${guy.user}, you have been gamebanned! You received 5 gamewarns during the last 3 months. You can request to be autounbanned with \`/gamewarn list\` on <t:${unix(warns[warns.length - 1].date / (1000).toFixed()).unix() + 7889400}:f>. You can also be directly unbanned after filling out this ban appeal form: <https://dyno.gg/form/fb0f5300>` })
        } else if (warns.length < 5 && guy.roles.cache.has(ids.gamebanned)) {
            guy.roles.remove(ids.gamebanned)
            guy.user.send({ content: `You are no longer gamebanned. Please make sure to follow the rules during the games and have fun.` })
        }
    })
}
