const repoConfig = require("../config/index.js")

if (!repoConfig) throw new Error("Cannot find the config module from GitHub!")

module.exports = repoConfig

// const { allRoles, roles } = require("./config/roles.js")
// const getRole = (rolename) => {
//   rolename = rolename.toLowerCase()
//   rolename = rolename.replace("-", " ")
//   let foundRole = roles.find((x) => x.name.toLowerCase() == rolename)
//   if (!foundRole) return { name: "Unknown Role", description: "Unable to find that role!", icon: "https://cdn.discordapp.com/emojis/424929422190182422.png?v=1" }
//   return foundRole
// }

// module.exports = {
//   emojis: {},
//   getRole,
//   allRoles,
//   roles,
//   botadmins: ["406412325973786624", "439223656200273932"],
//   fn: require("./config/fn.js")
// }

// module.exports.bombPlacements = ["1 2 3", "2 3 4", "5 6 7", "6 7 8", "9 10 11", "10 11 12", "13 14 15", "14 15 16", "1 5 9", "5 9 13", "2 6 10", "6 10 14", "3 7 11", "7 11 15", "4 8 12", "8 12 16", "1 6 11", "2 7 12", "3 6 9", "4 7 10", "5 10 15", "6 11 16", "7 10 13", "8 11 14"]
// module.exports.ids = require("./config/ids.js")
// module.exports.shop = {
//   colors: [
//     { name: "Blue", id: "606123652861394965" },
//     { name: "Yellow", id: "606123653469569084" },
//     { name: "Turquoise", id: "606123656535474187" },
//     { name: "Red", id: "606123651900899345" },
//     { name: "Crimson", id: "606123658016063507" },
//     { name: "Black", id: "606123654438453269" },
//     { name: "Pink", id: "606123655289634826" },
//     { name: "Green", id: "606123654106841088" },
//     { name: "Salmon", id: "606123655931494411" },
//   ],
// }
// module.exports.emojis = {
//   coin: `<:coin:606434686931173377>`,
//   rose: `<:rosesingle:807256844191793158>`,
//   gem: `<:gem:833431075309092904>`,
//   bouquet: `<:rosebouquet:808545517209387008>`,
// }

// module.exports.shop.items = [
//   { id: "color", name: "Color Role", price: 50, currency: "coin", description: "See all the available colors by using `+shop colors`" },
//   { id: "dj", name: "DJ Role", price: 450, currency: "coin", description: "Gain the ability to use the music bots both here and in a game!" },
//   { id: "immunity", name: "Immunity", price: 10, currency: "rose", description: "When spectating, I will not change your name to lazy spectator" },
//   { id: "profile", name: "Profile Command", price: 200, currency: "coin", description: "Gain the ability to use +profile" },
//   { id: "ranked", name: "Ranked Pass", price: 1500, currency: "coin", description: "Gain access to play ranked games!" },
//   { id: "emoji", name: "Emoji", price: 450, currency: "coin", description: "Gain access to the `-write` command" },
//   { id: "rose", name: "Rose", price: 25, currency: "coin", description: "Buy these to send someone a rose" },
//   { id: "bouquet", name: "Rose Bouquet", price: 250, currency: "coin", description: "Use these to give everyone in the game a rose, including yourself!" },
//   { id: "grey", name: "Grey Color Role", price: 200, currency: "coin", description: "Gain the very rare Grey Color role" },
//   { id: "cmi", name: "Custom Maker Item", price: 1500, currency: "coin", description: "You can use this to create your own role list when playing.\nThis does not give you the full set of role list. You need to buy the rest of the roles using coins or roses. To check the list, do `+cmi`!" },
//   { id: "channel", name: "Private Channel", price: 100, currency: "rose", description: "Create your own private channel in this server!" },
//   { id: "icon", name: "Icon", price: 20, currency: "rose", description: "Add an icon to your profile!" },
//   { id: "description", name: "Description", price: 25, currency: "rose", description: "Customize your profile description!" },
// ]
