const db = require("quick.db")
const olddb = require("../oldbot.json")
const fs = require("fs")

// const start = async () => {
//   asyncForEach(olddb, async (x) => {
//     sleep(3000)
//     let coins = x.points
//     let id = x.ID

//     if (!coins < 500) {
//       coins = Math.floor(coins / 10)
//       if (coins != 0) {
//         db.set(`money_${id}`, coins)
//         console.log(id, coins)
//       }
//     }
//   })
// }

for (let i = 0; i < olddb.length; i++) {
    let x = olddb[i]
    let coins = parseInt(x.points)
    let id = `${x.ID}`

    if (!coins < 500) {
        coins = Math.floor(coins / 10)
        if (coins != 0) {
            db.set(`money_${id}`, coins)
            console.log(id, coins)
        }
    }

    if (x.items.length > 1) db.set(`oldcmi_${id}`, true)
}

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

//start()