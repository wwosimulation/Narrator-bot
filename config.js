const {allRoles, roles} = require("./config/roles.js")
const getRole = (rolename) => {
  rolename = rolename.toLowerCase()
  let foundRole = roles.find(x => x.name.toLowerCase() == rolename)
  if(!foundRole) return {name: "Unknown Role", description: "Unable to find that role!", icon: "https://cdn.discordapp.com/emojis/424929422190182422.png?v=1"}
  return foundRole
}

module.exports = {
  emojis: {},
  getRole, allRoles, roles,
  botadmins: ["406412325973786624", "439223656200273932"],
  isBeta: (id) => {return ["801726595378315264","719564153072910407","406412325973786624","439223656200273932","159717599993790464","452632560795648000"].includes(id) ? true : false}

}

module.exports.bombPlacements = ["1 2 3", "2 3 4", "5 6 7", "6 7 8", "9 10 11", "10 11 12", "13 14 15", "14 15 16", "1 5 9", "5 9 13", "2 6 10", "6 10 14", "3 7 11", "7 11 15", "4 8 12", "8 12 16", "1 6 11", "2 7 12", "3 6 9", "4 7 10", "5 10 15", "6 11 16", "7 10 13", "8 11 14"]
module.exports.ids = {
  alive: "606140092213624859",
  dead: "606131202814115882",
  player: "606131215526789120",
  mini: "606155761286119425",
  narrator: "606139219395608603",
  spectator: "606140764682190849",
  server: {
    log: "693157346771468289",
    sim: "465795320526274561",
    game: "472261911526768642"
  }
}

module.exports.shop = {
  colors: [{name: "Blue", id: "606123652861394965"}, {name: "White", id: "710659352804982866"}, {name: "Orange", id: "665044536178769931"}, {name: "Yellow", id: "606123653469569084"}, {name: "Turquoise", id: "606123656535474187"}, {name: "Red", id: "606123651900899345"}, {name: "Crimson", id: "606123658016063507"}, {name: "Black", id: "606123654438453269"}, {name: "Pink", id: "606123655289634826"}, {name: "Green", id: "606123654106841088"}, {name: "Salmon", id: "606123655931494411"}]
}
module.exports.emojis.coin = `<:coin:606434686931173377>`
module.exports.emojis.rose = `<:rosesingle:807256844191793158>`

module.exports.shop.items = [
  { id: "color", name: "Color Roles", price: 50, currency: "coins", description: "See all the available colors by using `+shop colors`" },
  { id: "dj", name: "DJ Role", price: 450, currency: "coins", description: "Gain the ability to use the music bots both here and in a game!" },
  { id: "immunity", name: "Immunity", price: 10, currency: "roses", description: "When spectating, I will not change your name to lazy spectator" },
  { id: "profile", name: "Profile Command", price: 200, currency: "coins", description: "Gain the ability to use +profile" },
  { id: "ranked", name: "Ranked Pass", price: 1500, currency: "coins", description: "Gain access to play ranked games!" },
  { id: "emoji", name: "Emoji", price: 450, currency: "coins", description: "Gain access to the `-write` command" },
  { id: "rose", name: "Rose", price: 25, currency: "coins", description: "Buy these to send someone a rose" },
  { id: "bouquet", name: "Rose Bouquet", price: 250, currency: "coins", description: "Use these to give everyone in the game a rose, including yourself!" },
  { id: "graycolor", name: "Gray Color Role", price: 200, currency: "coins", description: "Gain the very rare Gray Color role" },
  { id: "cmi", name: "Custom Maker Item", price: 1500, currency: "coins", description: "You can use this to create your own role list when playing.\nThis does not give you the full set of role list. You need to buy the rest of the roles using coins or roses. To check the list, do `+cmi`!"},
  { id: "private", name: "Private Channel", price: 100, currency: "roses", description: "Create your own private channel in this server!"},
]