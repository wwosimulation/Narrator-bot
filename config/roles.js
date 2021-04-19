const { Collection } = require("discord.js")
const descriptions = require("./descriptions.js")
const icons = require("./icons.js")
const defaultRole = {
  name: "Error! Please inform Shadow about this!",
  icon: "https://cdn.discordapp.com/emojis/424929422190182422.png?v=1",
  aura: "Unknown",
  team: "Solo",
  soloKiller: false,
}

module.exports = {
  allRoles: [],
  roles: new Collection(),
}

const addRoleProperty = (rolename, property, value) => {
  let role = module.exports.roles.get(rolename)
  if (!role) {
    role = Object.assign({}, defaultRole)
    module.exports.allRoles.push(rolename)
    role.name = rolename
  }
  role[property] = value
  module.exports.roles.set(rolename, role)
}

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

for (let desc in descriptions) {
  let name = desc.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
  addRoleProperty(name, "description", descriptions[desc])
  addRoleProperty(name, "icon", icons[desc])
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

module.exports.roles.forEach((role) => {
  module.exports.allRoles.push(role.name)
})
