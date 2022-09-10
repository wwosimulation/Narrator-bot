module.exports = async (message, client) => {
    setTimeout(() => {
        client.commands.get("vt").run(message, [], client)
    }, 10000)
}
