module.exports = {
    name: "closegh",
    description: "A developer-only command to reply to issues regarding bugs or comment.",
    usage: `${process.env.PREFIX}closegh <issue number> [your comment]`,
    run: async (message, args, client) => {
        if (args.length < 1) return message.channel.send("Please add an issue number!")

        let issue = await client.github
            .request("GET /repos/{owner}/{repo}/issues/{issue_number}", {
                owner: "wwosimulation",
                repo: "tracker",
                issue_number: args[0],
            })
            .catch((e) => e)

        if (issue.status !== 200) return message.channel.send("Issue not found!")
        if (issue.data.state === "close") return message.channel.send("This issue has already closed!")

        let user = issue.data.body
            .split("\n")
            .find((r) => r.startsWith("**User ID:**"))
            ?.split(":**")[1]
            .trim()

        let closedIssue = await client.github
            .request("POST /repos/{owner}/{repo}/issues/{issue_number}", {
                owner: "wwosimulation",
                repo: "tracker",
                issue_number: args[0],
                state: "closed",
            })
            .catch((e) => e)

        if (closedIssue.status !== 200) return message.channel.send(`An error occured while I was trying to close the issue. Status code: \`${comment.status}\``)

        message.channel.send("The issue has been closed!")

        let hasComment = args.length > 1 ? true : false

        let comment = {}

        if (args.length > 1) {
            comment = await client.github
                .request("POST /repos/{owner}/{repo}/issues/{issue_number}", {
                    owner: "wwosimulation",
                    repo: "tracker",
                    issue_number: args[0],
                    body: "closed",
                })
                .catch((e) => e)

            if (comment.status !== 201) return message.channel.send(`An error occured while I was trying to comment. Status code: \`${comment.status}\``)

            message.channel.send("The comment has been sent!")
        }

        if (!user) return message.channel.send("I could not DM the user about the comment you made.")

        let member = await client.users.fetch(user).catch((e) => null)

        if (!member) return message.channel.send("I could not find the user to DM!")

        member
            .send(`Hello there ${member.username}!\nYour issue regarding \`${issue.data.title}\` has been closed by one of our developers.${hasComment ? `\n\nHere's a comment: ${comment.data.body}` : ""}`)
            .then((msg) => message.channel.send("The author of the issue has been notified!"))
            .catch((e) => message.channel.send("There was a problem when I tried sending a message to the user."))
    },
}
