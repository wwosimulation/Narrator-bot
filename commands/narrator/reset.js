const { MessageActionRow } = require("discord.js")
const db = require("quick.db")
const { ids } = require("../../config")

module.exports = {
    name: "reset",
    description: "Reset the database.",
    usage: `${process.env.PREFIX}reset`,
    gameOnly: true,
    run: async (message, args, client) => {
        console.log("hi")
        if (message.member.roles.cache.has(ids.narrator) || message.member.roles.cache.has(ids.mini)) {
            let times = [10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000]
            times = times[Math.floor(Math.random() * times.length)]
            console.log("hi")
            let gunner = message.guild.channels.cache.filter((c) => c.name === "priv-gunner").map((x) => x.id) // gunner
            let grumpy = message.guild.channels.cache.filter((c) => c.name === "priv-grumpy-grandma").map((x) => x.id) // gg
            let seer = message.guild.channels.cache.filter((c) => c.name === "priv-seer").map((x) => x.id) // seer
            let aura = message.guild.channels.cache.filter((c) => c.name === "priv-aura-seer").map((x) => x.id) // aura
            let doctor = message.guild.channels.cache.filter((c) => c.name === "priv-doctor").map((x) => x.id) // doc
            let beasthunter = message.guild.channels.cache.filter((c) => c.name === "priv-beast-hunter").map((x) => x.id) // bh
            let witch = message.guild.channels.cache.filter((c) => c.name === "priv-witch").map((x) => x.id) // witch
            let bodyguard = message.guild.channels.cache.filter((c) => c.name === "priv-bodyguard").map((x) => x.id) // bg
            let det = message.guild.channels.cache.filter((c) => c.name === "priv-detective").map((x) => x.id) // det
            let priest = message.guild.channels.cache.filter((c) => c.name === "priv-priest").map((x) => x.id) // priest
            let paci = message.guild.channels.cache.filter((c) => c.name === "priv-pacifist").map((x) => x.id) // paci
            let flower = message.guild.channels.cache.filter((c) => c.name === "priv-flower-child").map((x) => x.id) // fc
            let guardian = message.guild.channels.cache.filter((c) => c.name === "priv-guardian-wolf").map((x) => x.id) // gww
            let wwpaci = message.guild.channels.cache.filter((c) => c.name === "priv-wolf-pacifist").map((x) => x.id) // wwp
            let wwseer = message.guild.channels.cache.filter((c) => c.name === "priv-wolf-seer").map((x) => x.id) // wws
            let skiller = message.guild.channels.cache.filter((c) => c.name === "priv-serial-killer").map((x) => x.id) // sk
            let arsonist = message.guild.channels.cache.filter((c) => c.name === "priv-arsonist").map((x) => x.id) // arso
            let bomb = message.guild.channels.cache.filter((c) => c.name === "priv-bomber").map((x) => x.id) // bomber
            let secthunter = message.guild.channels.cache.filter((c) => c.name === "priv-sect-hunter").map((x) => x.id) // sect hunter
            let sorcerer = message.guild.channels.cache.filter((c) => c.name === "priv-sorcerer").map((x) => x.id) // sorcerer
            let wwshaman = message.guild.channels.cache.filter((c) => c.name === "priv-wolf-shaman").map((x) => x.id) // wwshaman
            let hh = message.guild.channels.cache.filter((c) => c.name === "priv-headhunter").map((x) => x.id)
            let jailer = message.guild.channels.cache.filter((c) => c.name === "priv-jailer").map((x) => x.id)
            let canni = message.guild.channels.cache.filter((c) => c.name === "priv-cannibal").map((x) => x.id)
            let nmww = message.guild.channels.cache.filter((c) => c.name === "priv-nightmare-werewolf").map((x) => x.id)
            let shadow = message.guild.channels.cache.filter((c) => c.name === "priv-shadow-wolf").map((x) => x.id)
            let ft = message.guild.channels.cache.filter((c) => c.name === "flowe-child").map((x) => x.id)
            let mm = message.guild.channels.cache.filter((c) => c.name === "priv-marksman").map((x) => x.id)
            let illu = message.guild.channels.cache.filter((c) => c.name === "priv-illusionist").map((x) => x.id)
            let corr = message.guild.channels.cache.filter((c) => c.name === "priv-corruptor").map((x) => x.id)
            let nb = message.guild.channels.cache.filter((c) => c.name === "priv-naughty-boy").map((x) => x.id)
            let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").map((x) => x.id)
            let bandit = message.guild.channels.cache.filter((c) => c.name === "priv-bandit").map((x) => x.id)
            let bandits = message.guild.channels.cache.filter((c) => c.name.startsWith("bandits")).map((x) => x.id)
            let wwb = message.guild.channels.cache.filter((c) => c.name === "priv-werewolf-berserk").map((x) => x.id)
            let tg = message.guild.channels.cache.filter((c) => c.name === "priv-tough-guy").map((x) => x.id)
            let dp = message.guild.channels.cache.filter((c) => c.name === "priv-doppelganger").map((x) => x.id)
            let kww = message.guild.channels.cache.filter((c) => c.name === "priv-kitten-wolf").map((x) => x.id)
            let forger = message.guild.channels.cache.filter((c) => c.name === "priv-forger").map((x) => x.id)
            let zombie = message.guild.channels.cache.filter((c) => c.name === "priv-zombie").map((x) => x.id)
            let mortician = message.guild.channels.cache.filter((c) => c.name === "priv-mortician").map((x) => x.id)
            let hacker = message.guild.channels.cache.filter((c) => c.name === "priv-hacker").map((x) => x.id)
            let king = message.guild.channels.cache.filter((c) => c.name === "priv-pumpkin-king").map((x) => x.id)
            console.log("hi")

            db.delete(`excludes`)

            message.guild.channels.cache
                .find((x) => x.name == "day-chat")
                .permissionOverwrites.edit(ids.alive, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: false,
                    VIEW_CHANNEL: false,
                })
            console.log("hi")

            message.guild.channels.cache
                .find((c) => c.name === "vote-chat")
                .permissionOverwrites.edit(ids.alive, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: true,
                    VIEW_CHANNEL: true,
                })
            console.log("hi")

            message.guild.channels.cache
                .find((x) => x.name == "game-lobby")
                .permissionOverwrites.edit(ids.alive, {
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true,
                    VIEW_CHANNEL: true,
                })
            console.log("hi")

            let t = client.guilds.cache.get(ids.server.sim).roles.cache.get("606123676668133428").members

            t.forEach((e) => {
                e.roles.remove("606123676668133428") // joining role
            })
            console.log("hi")

            client.channels.cache.get("606123818305585167").send(`Game ended! ${db.get(`winner`)} won the match!`)
            let mid = db.get("game")
            let s = client.guilds.cache.get(ids.server.sim)
            s.channels.cache
                .get("606123818305585167")
                .messages.fetch(mid)
                .then((m) => {
                    let allc = m.components
                    if (allc) {
                        let row = allc[0]
                        let button = row.components[0]
                        button.disabled = true
                        m.edit({ components: [new MessageActionRow().addComponents(button)] })
                    }
                })
            console.log("hi")

            db.set(`game`, null)
            db.set(`gamePhase`, -10)
            for (let i = 0; i < gunner.length; i++) {
                db.set(`bullets_${gunner[i]}`, 2)
                db.set(`did_${gunner[i]}`, 555)
            }
            console.log("hi")

            for (let i = 0; i < grumpy.length; i++) {
                db.set(`mute_${grumpy[i]}`, null)
            }

            for (let i = 0; i < seer.length; i++) {
                db.set(`seer_${seer[i]}`, "no")
            }

            for (let i = 0; i < aura.length; i++) {
                db.set(`auraCheck_${aura[i]}`, "no")
            }

            for (let i = 0; i < doctor.length; i++) {
                db.set(`heal_${doctor[i]}`, null)
            }

            for (let i = 0; i < beasthunter.length; i++) {
                db.set(`setTrap_${beasthunter[i]}`, null)
                db.set(`trapActive_${beasthunter[i]}`, false)
            }
            console.log("hi")

            for (let i = 0; i < witch.length; i++) {
                db.set(`potion_${witch[i]}`, null)
                db.delete(`ability_${witch[i]}`)
                db.set(`witchAbil_${witch[i]}`, 0)
            }

            for (let i = 0; i < bodyguard.length; i++) {
                db.set(`guard_${bodyguard[i]}`, null)
                db.set(`lives_${bodyguard[i]}`, 2)
            }

            for (let i = 0; i < det.length; i++) {
                db.set(`detCheck_${det[i]}`, null)
            }

            for (let i = 0; i < mortician.length; i++) {
                db.set(`mortician_${det[i]}`, null)
            }

            for (let i = 0; i < hacker.length; i++) {
                db.set(`hashacked_${message.channel.id}`, null)
                db.set(`hack_${message.channel.id}`, null)
                db.set(`secondhack_${message.channel.id}`, null)
                db.set(`usedmute_${message.channel.id}`, null)
            }
            console.log("hi")

            for (let i = 0; i < priest.length; i++) {
                db.set(`priest_${priest[i]}`, null)
            }

            for (let i = 0; i < paci.length; i++) {
                db.set(`paci_${paci[i]}`, "no")
                db.delete(`pacday_${paci[i]}`)
            }

            for (let i = 0; i < flower.length; i++) {
                db.set(`protest_${flower[i]}`, "no")
                db.set(`flower_${flower[i]}`, null)
            }

            for (let i = 0; i < guardian.length; i++) {
                db.set(`protest_${guardian[i]}`, "no")
                db.set(`guardian_${guardian[i]}`, null)
            }

            for (let i = 0; i < wwpaci.length; i++) {
                db.set(`paci_${wwpaci[i]}`, "no")
            }

            for (let i = 0; i < wwseer.length; i++) {
                db.set(`wwseer_${wwseer[i]}`, "no")
                db.set(`resign_${wwseer[i]}`, false)
            }
            console.log("hi")

            for (let i = 0; i < skiller.length; i++) {
                db.set(`stab_${skiller[i]}`, null)
            }

            for (let i = 0; i < arsonist.length; i++) {
                db.delete(`doused_${arsonist[i]}`)
                db.delete(`toDouse_${arsonist[i]}`)
            }

            for (let i = 0; i < canni.length; i++) {
                db.set(`eat_${canni[i]}`, null)
                db.set(`hunger_${canni[i]}`, 1)
            }

            for (let i = 0; i < bomb; i++) {
                db.set(`bombs_${bomb[i]}`, null)
                db.set(`didCmd_${bomb[i]}`, -1)
            }

            for (let i = 0; i < secthunter.length; i++) {
                db.set(`hunt_${message.channel.id}`, null)
            }

            for (let i = 0; i < sorcerer.length; i++) {
                db.set(`sorcerer_${sorcerer[i]}`, "no")
            }
            console.log("hi")

            for (let i = 0; i < wwshaman.length; i++) {
                db.set(`shaman_${wwshaman[i]}`, null)
            }

            for (let i = 0; i < hh.length; i++) {
                db.set(`hhtarget_${hh[i]}`, null)
            }

            for (let i = 0; i < nmww.length; i++) {
                db.set(`sleepy_${nmww[i]}`, null)
                db.set(`nightmare_${nmww[i]}`, 2)
            }

            for (let i = 0; i < shadow.length; i++) {
                db.set(`shadow_${shadow[i]}`, "no")
            }

            for (let i = 0; i < ft.length; i++) {
                db.set(`cards_${ft[i]}`, 2)
            }

            for (let i = 0; i < mm.length; i++) {
                db.set(`mark_${mm[i]}`, null)
                db.set(`markActive_${mm[i]}`, false)
                db.set(`arrows_${mm[i]}`, 2)
            }

            for (let i = 0; i < illu.length; i++) {
                db.delete(`disguised_${illu[i]}`)
                db.delete(`toDisguise_${illu[i]}`)
            }
            console.log("hi")

            for (let i = 0; i < corr.length; i++) {
                db.set(`corrupt_${corr[i]}`, null)
            }

            for (let i = 0; i < nb.length; i++) {
                db.set(`toy_${nb[i]}`, "no")
            }
            for (let i = 0; i < jailer.length; i++) {
                db.delete(`jail_${jailer[i]}`)
                db.set(`bullet_jail`, 1)
            }

            for (let i = 0; i < cupid.length; i++) {
                db.set(`couple_${cupid[i]}`, null)
            }

            for (let i = 0; i < bandit.length; i++) {
                db.set(`bandit_${bandit[i]}`, null)
            }

            for (let i = 0; i < bandits.length; i++) {
                db.set(`banditKill_${bandits[i]}`, null)
                db.set(`accomplice_${bandits[i]}`, null)
            }

            for (let i = 0; i < tg.length; i++) {
                db.set(`tough_${tg[i]}`, null)
            }

            for (let i = 0; i < tg.length; i++) {
                db.set(`frenzy_${wwb[i]}`, false)
                db.set(`abil_${wwb[i]}`, "no")
            }

            for (let i = 0; i < dp.length; i++) {
                db.delete(`copy_${dp[i]}`, null)
            }
            console.log("hi")

            for (let i = 0; i < kww.length; i++) {
                db.delete(`scratch_${kww[i]}`)
            }
            for (let i = 0; i < forger.length; i++) {
                db.set(`given_${forger[i]}`, true)
                db.set(`forged_${forger[i]}`, 3)
            }

            for (let i = 0; i < zombie.length; i++) {
                db.set(`bite_${zombie[i]}`, null)
            }

            for (let i = 0; i < king.length; i++) {
                db.delete(`pk_${shadow[i]}`)
            }

            // removing cards, shield and sword from players
            let allChannels = message.guild.channels.cache.filter((c) => c.name.startsWith("priv-")).map((x) => x.id)
            for (let i = 0; i < allChannels.length; i++) {
                if (db.get(`card_${allChannels[i]}`) == true) {
                    db.set(`card_${allChannels[i]}`, false)
                }
                if (db.get(`shield_${allChannels[i]}`) == true) {
                    db.set(`shield_${allChannels[i]}`, false)
                }
                if (db.get(`sword_${allChannels[i]}`) == true) {
                    db.set(`sword_${allChannels[i]}`, false)
                }
                if (db.get(`bitten_${allChannels[i]}`) == true) {
                    db.delete(`bitten_${allChannels[i]}`)
                }
            }
            console.log("hi")

            message.channel
                .send("Reset in progress")
                .then((msg) => {
                    setTimeout(function () {
                        msg.edit("Reset complete").catch((e) => message.channel.send(`Error: ${e.message}`))
                    }, times)
                })
                .catch((e) => message.channel.send(`Error: ${e.message}`))
            console.log("hi")
        }
    },
}
