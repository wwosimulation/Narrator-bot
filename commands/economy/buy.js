const Discord = require("discord.js")
const db = require("quick.db")
const config = require("../../config.js")
const pluralize = require("pluralize")

module.exports = {
  name: "buy",
  run: async (message, args, client) => {
    const sim = client.guilds.cache.get(config.ids.server.sim)
    const roleadd = (x) => {
      sim.members.cache.get(message.author.id).roles.add(`${x}`)
    }
    const rolehas = (x) => {
      return sim.members.cache.get(message.author.id).roles.cache.has(x)
    }
    let color,
      amount = 0,
      dontbuy = false

    const buyRole = (roleID) => {
      if (rolehas(roleID)) {
        dontbuy = true
        return message.channel.send(`Hey, you've already purchased that role!`)
      }
      roleadd(roleID)
    }

    if (!config.fn.isBeta(message.author.id)) return message.channel.send("Command isn't finished!")
    if (args.length < 1) return message.channel.send("Please specify an item from the shop to buy!")

    args.forEach((x, i) => {
      args[i] = x.toLowerCase()
    })

    if (["color", "colour"].includes(args[1]) && !["gray", "grey"].includes(args[0])) args.reverse()

    let item = config.shop.items.find((x) => x.id == args[0])
    switch (args[0]) {
      case "roses":
        item = config.shop.items.find((x) => x.id == "rose")
        break
      case "rose":
        if (args[1] == "bouquet") item = config.shop.items.find((x) => x.id == "bouquet")
        break
      case "color":
        color = config.shop.colors.find((x) => x.name.toLowerCase() == args[1])
        break
      case "gray":
        color = config.shop.items.find((x) => x.id == "grey")
        break
      case "private":
        item = config.shop.items.find(x => x.id == "channel")
      case "custom":
        item = config.shop.items.find((x) => x.id == "cmi")
    }
    console.log(item, args)
    if (!item) return message.channel.send("Sorry, I don't recognise that item!")
    //message.channel.send(JSON.stringify(item, null, 2), { code: "js" })
    let price = item.price || 0
    let balance = db.get(`money_${message.author.id}`)
    let roses = db.get(`roses_${message.author.id}`)
    let gems = db.get(`gems_${message.author.id}`)
    let userHas = item.currency == "coin" ? balance : item.currency == "rose" ? roses : gems

    if (item.id == "color" && !color) return message.channel.send(`Sorry, I don't recognize the color ${args[1]}.\nMake sure you choose a proper color from \`+shop colors\`!`)

    if(item.role) buyRole(item.role)
    if(item.id == "color") buyRole(color.id)

    if (item.id == "cmi") {
      let cmicheck = db.get(`cmi_${message.author.id}`)
      if (cmicheck) {
        dontbuy = true
        return message.channel.send(`Hey, you've already purchased the ${item.name}!`)
      }
    }

    if (item.id == "special") {
      let specialrolesname = sim.roles.cache.get("606247032553865227")
      let colorsrolename = sim.roles.cache.get("606247387496972292")
      let allsprole = sim.roles.cache.filter((r) => r.position < specialrolesname.position && r.position > colorsrolename.position)
      let hassprole = false
      allsprole.forEach((e) => {
        if (sim.members.cache.get(message.author.id).roles.cache.has(e.id)) {
          hassprole = true
          if (!db.get(`srole_${message.author.id}`)) {
            db.set(`srole_${message.author.id}`, e.id)
          }
        }
      })
      if (hassprole == true) return message.channel.send("You already purchased this item! Why are you wasting your gold?")
    }

    if (["rose", "bouquet"].includes(item.id)) {
      amount = parseInt(args[args.length - 1])
      if (!amount) amount = 1
    }

    if (dontbuy) return
    let totalPrice = (amount ? amount : 1) * item.price
    console.log(userHas, totalPrice)
    if (totalPrice > userHas) return message.channel.send(`Sorry, you don't have enough ${pluralize(item.currency)} for that!`)
    switch (item.currency) {
      case "coin":
        db.subtract(`money_${message.author.id}`, totalPrice)
        break
    }

    if (item.id == "cmi") {
      db.set(`cmi_${message.author.id}`, true)
    } else if (item.id == "profile") {
      db.set(`profile_${message.author.id}`, true)
    } else if (item.id == "special") {
      let colorsrolename = sim.roles.cache.get("606247387496972292")
      sim.roles
        .create({
          data: {
            name: `${message.author.username}'s Special role`,
            color: "#007880",
            position: colorsrolename.position + 1,
          },
        })
        .then((role) => {
          db.set(`srole_${message.author.id}`, role.id)
          sim.members.cache.get(message.author.id).roles.add(role.id)
        })
    } else if (["rose", "bouquet"].includes(item.id)) {
      db.add(`${item.id}${item.id == "rose" ? "G" : ""}_${message.author.id}`, amount)
    } else if (item.id == "icon" || item.id == "description"){
      message.channel.send("The feature to add these to your profile hasn't been implemented yet. Please send your " + item.id + " that you want to TheShadow#8124!")
    } else if (item.id == "private") {
      let t = await sim.channels.create(`${message.author.username}-channel`, {
        parent: "627536301008224275",
        permissionOverwrites: [
          {
            id: message.author.id,
            allow: ["MANAGE_CHANNELS", "SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "ATTACH_FILES"],
          },
        ],
      })
      await message.channel.send(`You have purchased a private channel! You can edit your channel at: ${t}`)
    }

    message.channel.send(`You have successfully purchased ${amount ? amount : "the"} ${color ? `${color.name} ` : ""}${pluralize(item.name, amount ? amount : 1)}!\nYou have been charged ${totalPrice} ${pluralize(item.currency)} ${config.emojis[item.currency]}!`)
  },
}
