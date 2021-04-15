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
  shop: {},
  emojis: {},
  allRoles: [],
  ids: {
    alive: "606140092213624859",
    dead: "606131202814115882",
    player: "606131215526789120",
    miniGN: "606155761286119425",
    narrator: "606139219395608603",
    spectator: "606140764682190849",
    logServer: "693157346771468289",
    simServer: "465795320526274561",
    gameServer: "472261911526768642",
  },
  botadmins: ["552814709963751425", "439223656200273932"],
}

module.exports.roles = {}
let auras = {
  Good: ["Villager", "Forger", "Loudmouth", "Santa Claus", "Easter Bunny", "Doctor", "Bodyguard", "Tough Guy", "Red Lady", "Priest", "Seer", "Aura Seer", "Spirit Seer", "Seer Apprentice", "Detective", "Sheriff", "Mayor", "Avenger", "Pacifist", "Flower Child", "Grumpy Grandma", "Cupid", "President", "Cursed", "Loudmouth", "Wise Man", "Sibling", "Idiot", "Handsome Prince", "Drunk", "Grave Robber"],
  Evil: ["Werewolf", "Junior Werewolf", "Wolf Pacifist", "Wolf Shaman", "Wolf Seer", "Shadow Wolf", "Wolf Pacifist", "Nightmare Werewolf", "Werewolf Berserk", "Kitten Wolf", "Guardian Wolf", "Sorcerer"],
}
let teams = {
  Village: ["Villager", "Doctor", "Bodyguard", "Tough Guy", "Red Lady", "Gunner", "Jailer", "Priest", "Marksman", "Seer", "Aura Seer", "Spirit Seer", "Seer Apprentice", "Detective", "Medium", "Mayor", "Witch", "Avenger", "Beast Hunter", "Pacifist", "Grumpy Grandma", "Cupid", "President", "Cursed", "Loudmouth", "Flower Child", "Sheriff", "Fortune Teller", "Forger", "Grave Robber", "Santa Claus", "Easter Bunny", "Sibling", "Drunk", "Mad Scientist", "Idiot", "Wise Man", "Doppelganger", "Naughty Boy", "Handsome Prince", "Sect Hunter"],
  Werewolf: ["Werewolf", "Junior Werewolf", "Wolf Pacifist", "Shadow Wolf", "Wolf Seer", "Kitten Wolf", "Wolf Shaman", "Alpha Werewolf", "Werewolf Berserk", "Nightmare Werewolf", "Guardian Wolf", "Kitten Wolf", "Sorcerer", "Lone Wolf"],
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

let soloKillers = ["Serial Killer", "Arsonist", "Bomber", "Corruptor", "Cannibal", "Illusionist", "Bandit", "Alchemist"]
soloKillers.forEach((role) => {
  addRoleProperty(role, "soloKiller", true)
})

Object.entries(module.exports.roles).forEach((role) => module.exports.allRoles.push(role[0]))

module.exports.bombPlacements = ["1 2 3", "2 3 4", "5 6 7", "6 7 8", "9 10 11", "10 11 12", "13 14 15", "14 15 16", "1 5 9", "5 9 13", "2 6 10", "6 10 14", "3 7 11", "7 11 15", "4 8 12", "8 12 16", "1 6 11", "2 7 12", "3 6 9", "4 7 10", "5 10 15", "6 11 16", "7 10 13", "8 11 14"]

module.exports.shop.colors = ["Blue, White, Orange, Yellow, Turquoise, Red, Crimson, Black, Pink, Green, Salmon"]
module.exports.emojis.coin = `<:coin:606434686931173377>`
module.exports.emojis.rose = `<:rosesingle:807256844191793158>`

module.exports.shop.items = [
  { name: "Color Roles", price: 50, currency: "coins", description: "See all the available colors by using `+shop colors`" },
  { name: "DJ Role", price: 450, currency: "coins", description: "Gain the ability to use the music bots both here and in a game!" },
  { name: "Emoji", price: 450, currency: "coins", description: "Gain access to the `-write` command" },
  { name: "Immunity", price: 10, currency: "roses", description: "When spectating, I will not change your name to lazy spectator  " },
  { name: "Custom Maker Item", price: 1500, currency: "coins", description: "You can use this to create your own role list when playing.\nThis does not give you the full set of role list. You need to buy the rest of the roles using coins or roses. To check the list, do `+cmi`!"},
]