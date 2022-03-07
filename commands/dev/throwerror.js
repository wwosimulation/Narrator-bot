module.exports = {
    name: "throwerror",
    description: "Throw an error to test error handling",
    usage: `${process.env.PREFIX}throwerror`,
    run: async (message, args, client) => {
        if (!["439223656200273932", "801726595378315264", "263472056753061889", "517335997172809728", "552814709963751425"].includes(message.author.id)) return
        throw new Error("Testing, good job")
    },
}
