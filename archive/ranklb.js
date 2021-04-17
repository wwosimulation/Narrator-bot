const db = require("quick.db")

module.exports = {
    name: "ranklb",
    run: async (message, args, client) => {
        let narr = client.guilds.cache.get("465795320526274561").roles.cache.get("606123619999023114")
        let mini = client.guilds.cache.get("465795320526274561").roles.cache.get("606123620732895232")
        if (!message.member.roles.cache.has(narr.id) && !message.member.roles.cache.has(mini.id)) return;

        let allrank = db.all().filter(data => data.ID.startsWith("ranked")).sort((a ,b) => b.data - a.data)
        
        let allstar = ""
        let legend = ""
        let diamond = ""
        let gold = ""
        let silver = ""
        let bronze = ""
        
        let count = "0"
        allrank.forEach(e => {
            let star = db.get(e.ID)
            let user = client.users.cache.get(e.ID.split("_")[1])
            if (user) {
                count++
                if (star > 500) {
                    allstar += `${count}. \`${user.tag}\` - ${star}⭐\n`
                } else if (star > 400 && star < 501) {
                    legend += `${count}. \`${user.tag}\` - ${star}⭐\n`
                } else if (star > 300 && star < 401) {
                    diamond += `${count}. \`${user.tag}\` - ${star}⭐\n`
                } else if (star > 200 && star < 301) {
                    gold += `${count}. \`${user.tag}\` - ${star}⭐\n`
                } else if (star > 100 && star < 201) {
                    silver += `${count}. \`${user.tag}\` - ${star}⭐\n`
                } else if (star < 101) {
                    bronze += `${count}. \`${user.tag}\` - ${star}⭐\n`
                }
            }
        })
        
        if (allstar != "") {
            message.channel.send(`**:six: ALL STAR League**\n${allstar}`)
        }
        if (legend != "") {
            message.channel.send(`**:five: Legend League**\n${legend}`)
        }
        if (diamond != "") {
            message.channel.send(`**:fpur: Diamond League**\n${diamond}`)
        }
        if (gold != "") {
            message.channel.send(`**:three: Gold League**\n${gold}`)
        }
        if (silver != "") {
            message.channel.send(`**:two: Silver League**\n${silver}`)
        }
        if (bronze != "") {
            message.channel.send(`**:one: Bronze League**\n${bronze}`)
        }
    }
}
