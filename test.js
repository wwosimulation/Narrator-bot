const expect = require("expect.js")
const fs = require("fs")

describe("Commands", () => {
    fs.readdir("./commands/", (err, files) => {
        files.forEach((file) => {
            let path = `./commands/${file}`
            fs.readdir(path, (err, files) => {
                if (err) console.error(err)
                let jsfile = files.filter((f) => f.split(".").pop() === "js")
                if (jsfile.length <= 0) return
                jsfile.forEach((f, i) => {
                    it(`should not error for ${f}, and should return an object`, function () {
                        try {
                            let x = require(`./commands/${file}/${f}`)
                            expect(x).to.be.an("object")
                        } catch (err) {
                            if (err) console.error(err)
                        }
                    })
                })
            })
        })
    })
})

describe("Events", () => {
    const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"))
    for (const file of eventFiles) {
        it(`should not error for ${file}, and should return an object`, function () {
            try {
                let x = require(`./events/${file}`)
                expect(x).to.be.a("function")
            } catch (error) {
                console.error(error)
            }
        })
    }
})

describe("Client", () => {
    it("should not error, and should return an object", function () {
        let server = require("./server")
        setTimeout(() => server.client.destroy(), 5000)
        expect(server).to.be.an("object")
    })
})

describe("Config", () => {
    it("should not error, and should return an object", () => {
        let config = require("./config")
        expect(config).to.be.an("object")
    })
})

describe("l10n", () => {
    const languageFiles = fs.readdirSync("./l10n").filter((file) => file.endsWith(".json") && !file.startsWith("package"))
    for (const file of languageFiles) {
        it(`should load the ${file} language correctly`, () => {
            const language = require(`./l10n/${file}`)
            expect(language).to.be.an("object")
        })
    }
    it(`should load the main function correctly`, () => {
        let l10n = require("./l10n")
        expect(l10n).to.be.a("function")
    })
    it(`should load allLanguages correctly`, () => {
        let allLang = require("./l10n/allLanguages")
        expect(allLang).to.be.a("array")
    })
})

Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {})
