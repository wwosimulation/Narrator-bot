const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "buy",
    run: async (message, args, client) => {
        if (message.author.id != "552814709963751425") return
        if (args.length < 1) return message.channel.send("Now i want you to think really hard about this one.")
        
        let buy = args.join(" ").toLowerCase()
        let balance = db.get(`money_${message.author.id}`) || 0        
        
        if (buy.includes("roses")) {
            if (buy.includes("single")) {
                let price = 25
                if (price > balance) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 25)
                message.channel.send("You have bought 1 rose!")
            } else if (buy.includes("bouquet")) {
                let price = 250
                let balance = db.get(`money_${message.author.id}`) || 0
                if (price > balance) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 250)
                message.channel.send("You have bought 1 bouquet of rose!")
            } else {
                return message.channel.send("I am not sure which rose do you want! `+buy rose single` or `+buy rose bouquet`")
            }
        } else if (buy.includes("colour")) {
            function roleadd(x) {
                client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.add(`${x}`)
            }
            function rolehas(x) {
                return client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.cache.has(x);
            }
            let price = 50
            if (buy.includes("red")) {
                if (rolehas("606123651900899345")) return message.channel.send("You have already bought this role!")
                if (price > balance) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 50)
                message.channel.send("You have bought the Red colour role! Check out your colour!")
                roleadd("606123651900899345")
            } else if (buy.includes("blue")) {
                if (rolehas("606123652861394965")) return message.channel.send("You have already bought this role!")
                if (price > balance) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 50)
                message.channel.send("You have bought the Blue colour role! Check out your colour!")
                roleadd("606123652861394965")
            } else if (buy.includes("green")) {
                if (rolehas("606123654106841088")) return message.channel.send("You have already bought this role!")
                if (price > balance) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 50)
                message.channel.send("You have bought the Green colour role! Check out your colour!")
                roleadd("606123654106841088")
            } else if (buy.includes("yellow")) {
                if (rolehas("606123653469569084")) return message.channel.send("You have already bought this role!")
                if (price > balance) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 50)
                message.channel.send("You have bought the Yellow colour role! Check out your colour!")
                roleadd("606123653469569084")
            } else if (buy.includes("black")) {
                if (rolehas("606123652861394965")) return message.channel.send("You have already bought this role!")
                if (price > balance) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 50)
                message.channel.send("You have bought the Black colour role! Check out your colour!")
                roleadd("606123652861394965")
            } else if (buy.includes("salmon")) {
                if (rolehas("606123655931494411")) return message.channel.send("You have already bought this role!")
                if (price > balance) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 50)
                message.channel.send("You have bought the Salmon colour role! Check out your colour!")
                roleadd("606123655931494411")
            } else if (buy.includes("pink")) {
                if (rolehas("606123655289634826")) return message.channel.send("You have already bought this role!")
                if (price > balance) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 50)
                message.channel.send("You have bought the Pink colour role! Check out your colour!")
                roleadd("606123655289634826")
            } else if (buy.includes("turquoise")) {
                if (rolehas("606123656535474187")) return message.channel.send("You have already bought this role!")
                if (price > balance) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 50)
                message.channel.send("You have bought the Turquoise colour role! Check out your colour!")
                roleadd("606123656535474187")
            } else if (buy.includes("crimson")) {
                if (rolehas("606123658016063507")) return message.channel.send("You have already bought this role!")
                if (price > balance) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 50)
                message.channel.send("You have bought the Crimson colour role! Check out your colour!")
                roleadd("606123658016063507")
            } else {
                return message.channel.send("Unknown colour! These are the following colours: `Red` `Blue` `Green` `Yellow` `Black` `Salmon` `Pink` `Turquoise` `Crimson`")
            }
        } else if (buy.includes("lootbox")) {
            let rolehas = client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.cache
            if (buy.includes("premium")) {
                let price = 100
                if (rolehas("606123666895274003")) return message.channel.send("You already bought this item! Why are you wasting your gold?")
                if (balance < price) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 100)
                client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.add("606123666895274003")
                message.channel.send("You have bought the Premium Lootbox role!")
            } else if (buy.includes("elite")) {
                let price = 150
                if (rolehas("606123666257870868")) return message.channel.send("You already bought this item! Why are you wasting your gold?")
                if (balance < price) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
                db.subtract(`money_${message.author.id}`, 150)
                client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.add("606123666257870868")
                message.channel.send("You have bought the Elite Lootbox role!")
            } else {
                return message.channel.send("Unknown lootbox! Available lootboxes: `Premium` `Elite`")
            }
        } else if (buy.includes("dj")) {
            let price = 450
            if (client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.cache.has("606123674562723840")) return message.channel.send("You already bought this item! Why are you wasting your gold?")
            if (balance < price) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
            db.subtract(`money_${message.author.id}`, 450)
            message.channel.send("You have bought the DJ role!")
            client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.add("606123674562723840")
        } else if (buy.includes("profile")) { 
            let price = 200
            if (db.get(`profile_${message.author.id}`)) return message.channel.send("You already bought this item! Why are you wasting your gold?")
            if (balance < price) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
            message.channel.send("You have bought the profile item! Finally, you can do `+profile` and be lazy.")
            db.subtract(`money_${message.author.id}`, 200)
            db.set(`profile_${message.author.id}`, true)
        } else if (buy.includes("special")) {
            let price = 500
            let specialrolesname = client.guilds.cache.get("465795320526274561").roles.cache.get("606247032553865227")
            let colorsrolename = client.guilds.cache.get("465795320526274561").roles.cache.get("606247387496972292")
            let allsprole = client.guilds.cache.get("465795320526274561").roles.cache.filter(r => r.position < specialrolesname.position && r.position > colorsrolename.position)
            let hassprole = false
            allsprole.forEach(e => {
                if (client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.cache.has(e.id)) {
                    hassprole = true
                    if (!db.get(`srole_${message.author.id}`)) {
                        db.set(`srole_${message.author.id}`, e.id)
                    }
                }
            })
            if (hassprole == true) return message.channel.send("You already bought this item! Why are you wasting your gold?")
            if (balance < price) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
            db.subtract(`money_${message.author.id}`, 450)
            message.channel.send("You have bought the Special role! To change it's name, just do `+namechange [name]`. To change the colour, just do +colorchange [colour]")
            client.guilds.cache.get("465795320526274561").roles.create({
                data: {
                    name: `${message.author.username}'s Special role`, 
                    color: "#007880",
                    position: 155
                }
            }).then(role => {
                db.set(`srole_${message.author.id}`, role.id)
                client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.add(role.id)
            })
        } else if (buy.includes("immun")) {
            let price = 500
            if (client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.cache.has("691390867822477413")) return message.channel.send("You already bought this item! Why are you wasting your gold?")
            if (balance < price) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
            db.subtract(`money_${message.author.id}`, 500)
            client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.add("691390867822477413")
            message.channel.send("You have bought the Immunity item! You do know you will still be lazy right?")
        } else if (buy.includes("emoji")) {
            let price = 500
            if (client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.cache.has("663389088354664477")) return message.channel.send("You already bought this item! Why are you wasting your gold?")
            if (balance < price) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
            db.subtract(`money_${message.author.id}`, 500)
            client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.add("663389088354664477")
            message.channel.send("You have bought the Emoji item! Paying just to get some fancy letters isn't a thing.")
        } else if (buy.includes("cmi") || buy.includes("custom")) {
            let price = 1500
            if (db.get(`cmi_${message.author.id}`)) return message.channel.send("You already bought this item! Why are you wasting your gold?")
            if (balance < price) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
            db.subtract(`money_${message.author.id}`, 1500)
            db.set(`cmi_${message.author.id}`, "yes")
            message.channel.send("You have bought the Custom Maker Item! To check which roles you have, do `+inv`. To see the role price list, do `+cmi` and to buy roles, do `+cmi buy [role]`!")
        } else if (buy.includes("private")) {
            let price = 2500
            if (client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.cache.has("627539599862005760")) return message.channel.send("You already bought this item! Why are you wasting your gold?")
            if (balance < price) return message.channel.send("You do not have enough gold in your hands! Come back to me when you have more!")
            db.subtract(`money_${message.author.id}`, 2500)
            client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.add("627539599862005760")
            let t = await client.guilds.cache.get("465795320526274561").channels.create(`${message.author.username}-channel`, {
                parent: "627536301008224275",
                permissionOverwrites: [
                    {
                        id: message.author.id,
                        allow: ["MANAGE_CHANNELS", "SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "ATTACH_FILES"]
                    }
                ]
            })
            await message.channel.send("You have bought a private channel! You can edit your channel at: ${t}")
        }
    }
}
