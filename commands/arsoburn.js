const db = require("quick.db");

module.exports = {
  name: "arsoburn",
  run: async (message, args, client) => {
    if (message.member.hasPermission("MANAGE_CHANNELS")) {
			if (message.author.id == `476433351323025410`) 	return await db.fetch('I thought you like to use dyno? I am not gonna work if its you.')
      for (let i = 0; i < args.length; i++) {
        let day = message.guild.channels.find(c => c.name === "day-chat");
        let alive = message.guild.roles.find(r => r.name === "Alive");
        let dead = message.guild.roles.find(r => r.name === "Dead");
        let guy = message.guild.members.find(m => m.nickname === args[i]);
        let role = await db.fetch(`role_${guy.id}`);
        day.send(
          `The Arsonist ignites **${args[i]} ${guy.user.username} (${role})**!`
        );
        guy.removeRole(alive.id);
        guy.addRole(dead.id);
        if (role == 'Junior Werewolf') {
          let tag = await db.fetch(`jtag_${guy.id}`)
          if (tag.roles.has("606140092213624859") || tag != null) {
            let byebye = message.guild.members.find(m => m.nickname === tag)
            let gg = await db.fetch(`role_${byebye.id}`) 
            day.send(`The Junior Werewolf's death has been avenged! **${tag} ${byebye.username} (${gg})** has died!`)
            byebye.addRole(dead.id) 
            byebye.removeRole(alive.id) 
          } 
        } 
      }
    }
  }
};
