/*
Copyright Shadow Development, April 2020
This script gets all the js files in the schemas folder
and maps each of them as a database schema.
These schemas are then exported from this file in an object.

Usage: 

const { botban } = require("./db.js")
let ban = await botban.findOne({user: message.author.id}).exec()
message.channel.send(ban)

*/

const mongoose = require("mongoose")
const fs = require("fs")
const qdb = require("quick.db")
const gamewarns = require("./schemas/gamewarns")

mongoose.connect(process.env.MONGODB, {
    // useNewUrlParser: true, -> default: true
    // useUnifiedTopology: true, -> default: true
    // useFindAndModify: false, -> set to false
    // useCreateIndex: true, -> set to true
})

module.exports = {}

const routeFiles = fs.readdirSync(__dirname + "/schemas").filter((file) => file.endsWith(".js"))
for (const file of routeFiles) {
    const route = require(`./schemas/${file}`)
    module.exports[`${file.split(`.`).shift()}`] = route
}

Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {})

let x = -1
setTimeout(async () => {
    x = qdb.get("gamewarnIndex") || (await module.exports.gamewarns.findOne({}).sort({ index: -1 }))
    await qdb.set("gamewarnIndex", (typeof x == "number" ? x : x.index) ?? -1)
}, 1000)
