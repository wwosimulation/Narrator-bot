module.exports = {
  name: "getrandom",
  run: async (message, args, client) => {
    if (message.channel.name === "commands") {
      if (args[0] == "rrv") {
        let rv = [
          "Villager",
          "Doctor",
          "Bodyguard",
          "Tough Guy",
          "Red Lady",
          "Priest",
          "Marksman",
          "Aura Seer",
          "Spirit Seer",
          "Seer Apprentice \n\nOnly add this role if a Seer is in game",
          "Sheriff",
          "Mayor",
          "Witch",
          "Avenger",
          "Beast Hunter",
          "Pacifist",
          "Flower Child",
          "Grumpy Grandma",
          "Loudmouth"
        ];
      } else if (args[0] == "rsv") {
        let rsv = [
          "Medium",
          "Gunner",
          "Jailer\n\nIf this role already existed, please retry the command again!",
          "Seer",
          "Detective",
          "Fortune Teller",
          "Forger"
        ];
      } else if (args[0] == "rww") {
        let rww = [
          "Werewolf",
          "Junior Werewolf",
          "Nightmare Werewolf",
          "Wolf Pacifist",
          "Wolf Shaman",
          "Kitten Wolf",
          "Shadow Wolf",
          "Guardian Wolf",
          "Werewolf Berserk",
          "Alpha Werewolf",
          "Wolf Seer"
        ];
      } else if (args[0] == "rvoting") {
        let rvoting = ["Fool", "Headhunter"];
      } else if (args[0] == "rsk") {
        let rsk = [
          "Serial Killer",
          "Corruptor",
          "Arsonist",
          "Bomber",
          "Illusionist",
          "Cannibal",
          "Sect Leader",
          "Lone Wolf",
          "Bandit",
          "Sect Leader\n\nReroll if this role was rolled before",
          "Zombie"
        ];
      } else if (args[0] == "random") {
        message.channel.send("When doing -srole random, just do -srole random random etc.")
      } else {
        message.channel.send("This type of random does not exist! \n\nAvailable options: `rrv` `rsv` `rvoting` `rww` `rsk`")
      }
    }
  }
};
