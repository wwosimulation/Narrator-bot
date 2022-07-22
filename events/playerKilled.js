const db = require("quick.db")

function getPhase() {
    const gamePhase = db.get(`gamePhase`)
    const voting = db.get(`commandEnabled`)
    let time = gamePhase % 3 === 0 ? "night" : voting === true ? "voting" : "day"
    let date = Math.floor(gamePhase / 3) + 1
    return { during: time, on: date }
}

module.exports = (client) => {
    
    client.on("playerKilled", async (guy, attacker) => {

        
        const phase = getPhase()

        if (typeof attacker !== "object") return;
        db.set(`player_${guy.id}.killedBy`, attacker.id)
        db.set(`player_${guy.id}.killedDuring`, phase.during)
        db.set(`player_${guy.id}.killedOn`, phase.on)

        // other code
        if (attacker === "NARRATOR" || attacker === "SUICIDE") return;

    })

}