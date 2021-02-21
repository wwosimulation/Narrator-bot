Use these schemas like this:
```js
const db = require(process.cwd() + "/db.js")
let player = db.players.findOne({user: message.author.id}).exec()
console.log(player.coins)
```
