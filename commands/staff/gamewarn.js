/*module.exports = {
    name: "gamewarn",
    description: "Give a gamewarn to a player.",
    usage: `${process.env.PREFIX}gamewarn <user>`,
    aliases: ["gwarn"],
    staffOnly: true,
    run: async (message, args, client) => {
        let users = client.users.cache
        let guildMembers = message.guild.members.cache
        let members = guildMembers.filter(m => m.user.tag.toLowerCase().startsWith(args[0].toLowerCase()) || m.user.username.toLowerCase().startsWith(args[0].toLowerCase()) || m?.nickname.toLowerCase().startsWith(args[0].toLowerCase()))
        
        
        let user = client.users.resolve(args[0]) || 
        users.find(u => u.tag == args[0]) || 
        users.find(u => u.username == args[0]) || 
        users.find(u => u)
        message.mentios.users.first()
    },
}*/