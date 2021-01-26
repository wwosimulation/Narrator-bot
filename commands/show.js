const Discord = require("discord.js")

module.exports = {
    name: "show",
    run: async (message, args, client) => {
        message.delete()

        let webhookClient 
        let channel = message.guild.channels.cache.find(c => c.name === "priv-wolf-medium")
        const webhooks = await channel.fetchWebhooks();
        let webhook
        if (message.author.id == "452632560795648000") {
            // dank memer
            webhookClient = new Discord.WebhookClient("790200909565132830", "0OyaaQAC-kndwISfQFCAfPGF51utuwGtLlaA1UK6Opvt81mvVlvNXCKeJYxqCBQiXDNE");

            webhook = webhooks.find(w => w.name === "Dank Memer");

        } else if (message.author.id == "640190820615716864") {

            // dyno
            webhookClient = new Discord.WebhookClient('789875735279042600', 'SWWVBdAMrKc2i4vaIggA7LRuBhE-xYgCqJY0CIgoZGPxS4-bvY9UVRoI_XR78O1zhyx9');

            webhook = webhooks.find(w => w.name === "Dyno");


        } else if (message.author.id == "552814709963751425") {

            // mbex
            webhookClient = new Discord.WebhookClient("790200713204465705", "UR5v01SUNf4KCsXA7k1UriFdn8nLt3imC7I9BpQP3z1cbwaIXWP6pkpyh_Smh4BjXYoE");

            webhook = webhooks.find(w => w.name === "MBEX");


        } else {
            return
        }

        webhook.send(args.join(" "))
        
        


    }
}