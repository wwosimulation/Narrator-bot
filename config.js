const defaultRole = {
    aura: "Unknown",
    team: "Solo",
    soloKiller: false,
}

const addRoleProperty = (rolename, property, value) => {
    let role = module.exports.roles[rolename]
    if (!role) {
        role = Object.assign({}, defaultRole)
        module.exports.allRoles.push(rolename)
    }
    role[property] = value
    module.exports.roles[rolename] = role
}

module.exports = {
    logServer: "693157346771468289",
    allRoles: [],
    botadmins: ["552814709963751425", "439223656200273932"],
}

module.exports.roles = {}
let auras = {
    Good: [
        "Villager",
        "Forger",
        "Loudmouth",
        "Santa Claus",
        "Easter Bunny",
        "Doctor",
        "Bodyguard",
        "Tough Guy",
        "Red Lady",
        "Priest",
        "Seer",
        "Aura Seer",
        "Spirit Seer",
        "Seer Apprentice",
        "Detective",
        "Sheriff",
        "Mayor",
        "Avenger",
        "Pacifist",
        "Flower Child",
        "Grumpy Grandma",
        "Cupid",
        "President",
        "Cursed",
        "Loudmouth",
        "Wise Man",
        "Sibling",
        "Idiot",
        "Handsome Prince",
        "Drunk",
        "Grave Robber",
    ],
    Evil: [
        "Werewolf",
        "Junior Werewolf",
        "Wolf Pacifist",
        "Wolf Shaman",
        "Wolf Seer",
        "Shadow Wolf",
        "Wolf Pacifist",
        "Nightmare Werewolf",
        "Werewolf Berserk",
        "Kitten Wolf",
        "Guardian Wolf",
        "Sorcerer",
    ],
}
let teams = {
    Village: [
        "Villager",
        "Doctor",
        "Bodyguard",
        "Tough Guy",
        "Red Lady",
        "Gunner",
        "Jailer",
        "Priest",
        "Marksman",
        "Seer",
        "Aura Seer",
        "Spirit Seer",
        "Seer Apprentice",
        "Detective",
        "Medium",
        "Mayor",
        "Witch",
        "Avenger",
        "Beast Hunter",
        "Pacifist",
        "Grumpy Grandma",
        "Cupid",
        "President",
        "Cursed",
        "Loudmouth",
        "Flower Child",
        "Sheriff",
        "Fortune Teller",
        "Forger",
        "Grave Robber",
        "Santa Claus",
        "Easter Bunny",
        "Sibling",
        "Drunk",
        "Mad Scientist",
        "Idiot",
        "Wise Man",
        "Doppelganger",
        "Naughty Boy",
        "Handsome Prince",
        "Sect Hunter",
    ],
    Werewolf: [
        "Werewolf",
        "Junior Werewolf",
        "Wolf Pacifist",
        "Shadow Wolf",
        "Wolf Seer",
        "Kitten Wolf",
        "Wolf Shaman",
        "Alpha Werewolf",
        "Werewolf Berserk",
        "Nightmare Werewolf",
        "Guardian Wolf",
        "Kitten Wolf",
        "Sorcerer",
        "Lone Wolf",
    ],
}

for (let aura in auras) {
    auras[aura].forEach((role) => {
        addRoleProperty(role, "aura", aura)
    })
}

for (let team in teams) {
    teams[team].forEach((role) => {
        addRoleProperty(role, "team", team)
    })
}

let soloKillers = [
    "Serial Killer",
    "Arsonist",
    "Bomber",
    "Corruptor",
    "Cannibal",
    "Illusionist",
    "Bandit",
    "Alchemist",
]
soloKillers.forEach((role) => {
    addRoleProperty(role, "soloKiller", true)
})

Object.entries(module.exports.roles).forEach((role) => module.exports.allRoles.push(role[0]))

module.exports.bombPlacements = [
	"1 2 3",
	"2 3 4",
	"5 6 7",
	"6 7 8",
	"9 10 11",
	"10 11 12",
	"13 14 15",
	"14 15 16",
	"1 5 9",
	"5 9 13",
	"2 6 10",
	"6 10 14",
	"3 7 11",
	"7 11 15",
	"4 8 12",
	"8 12 16",
	"1 6 11",
	"2 7 12",
	"3 6 9",
	"4 7 10",
	"5 10 15",
	"6 11 16",
	"7 10 13",
	"8 11 14",
]