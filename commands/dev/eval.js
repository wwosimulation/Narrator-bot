const Discord = require("discord.js")
const qdb = require("quick.db")
const db = require("../../db")
const shuffle = require("shuffle-array")
const config = require("../../config.js")
const fs = require("fs")

module.exports = {
    name: "eval",
    run: async (message, args, client) => {
        if (message.content.includes("TOKEN")) return await message.channel.send("Yeah no, we aren't dumb enough to give our token away ok? Now get back to your dumb life")
        if (!["439223656200273932"].includes(message.author.id)) return
        try {
            if (!args[0]) return message.channel.send("undefined", { code: "js" })

            let codeArr = args.slice(0).join(" ").split("\n")
            if (!codeArr[codeArr.length - 1].startsWith("return")) codeArr[codeArr.length - 1] = `return ${codeArr[codeArr.length - 1]}`

            const code = `async () => { ${codeArr.join("\n")} }`

            let out = await eval(code)()
            if (typeof out !== "string") out = require("util").inspect(out)
            out = out.replace(process.env.TOKEN, "[TOKEN REDACTED]").replace(process.env.MONGODB, "[DB URI REDACTED]")

            message.channel.send(`Typeof output: **${typeof out}**`)
            message.channel.send(out ? out : "null", { split: true, code: "js" })
        } catch (err) {
            message.channel.send("An error occurred when trying to execute this command.")
            console.log(err)
            return message.channel.send(`${err}`, { code: "js" })
        }
    },
}
