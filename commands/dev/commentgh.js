module.exports = {
    name: "commentgh",
    description: "A developer-only command to reply to issues regarding bugs or comment.",
    usage: `${process.env.PREFIX}comment <issue number> <your comment>`,
    run: async (message, args, client) => {
        if (args.length < 2) return message.channel.send("Please add an issue number as well as your comment!")

        let issue = await client.github
            .request("GET /repos/{owner}/{repo}/issues/{issue_number}", {
                owner: "wwosimulation",
                repo: "tracker",
                issue_number: args[0],
            })
            .catch((e) => e)

        if (issue.status !== 200) return message.channel.send("Issue not found!")

        let user = issue.data.body
            .split("\n")
            .find((r) => r.startsWith("**User ID:**"))
            ?.split(":**")[1]
            .trim()

        let comment = await client.github
            .request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
                owner: "wwosimulation",
                repo: "tracker",
                issue_number: args[0],
                body: args.splice(1).join(" "),
            })
            .catch((e) => e)

        if (comment.status !== 201) return message.channel.send(`An error occured while I was trying to comment. Status code: \`${comment.status}\``)

        message.channel.send("Your comment has been sent!")

        if (!user) return message.channel.send("I could not DM the user about the comment you made.")

        let member = await client.users.fetch(user).catch((e) => null)

        if (!member) return message.channel.send("I could not find the user to DM!")

        member
            .send(`Hello there ${member.username}!\nYou have received a new comment from one of our devs on your issue regarding: \`${issue.data.title}\`.\n\nComment: __${comment.data.body}__`)
            .then((msg) => message.channel.send("The author of the issue has been notified!"))
            .catch((e) => message.channel.send("There was a problem when I tried sending a message to the user."))
    },
}
