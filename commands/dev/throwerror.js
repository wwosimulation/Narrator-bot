module.exports = {
    name: "throwerror",
    description: "Throw an error to test error handling",
    usage: `${process.env.PREFIX}throwerror`,
    run: async (message, args, client) => {
        if (!["439223656200273932"].includes(message.author.id)) return
        throw new Error("Testing, good job")
    },
}
