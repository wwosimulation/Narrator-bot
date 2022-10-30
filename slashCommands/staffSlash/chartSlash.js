const Chart = require("chart.js")
const { ChartJSNodeCanvas } = require("chartjs-node-canvas")

const width = 800 //px
const height = 400 //px
const backgroundColour = "white"
const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour,
})

const { stats } = require("../../db.js")

module.exports = {
    command: {
        name: "chart",
        description: "view a chart of collected data",
        options: [
            {
                type: "STRING",
                name: "type",
                description: "the type of data to view",
                required: true,
                choices: [
                    {
                        name: "Games",
                        value: "games",
                    },
                    {
                        name: "Members",
                        value: "members",
                    },
                ],
            },
            {
                type: "STRING",
                name: "time",
                description: "the time period to view",
                required: true,
                choices: [
                    {
                        name: "Hours",
                        value: "hours",
                    },
                    {
                        name: "Days",
                        value: "days",
                    },
                    {
                        name: "Months",
                        value: "months",
                    },
                    {
                        name: "Years",
                        value: "years",
                    },
                ],
            },
        ],
    },
    run: async (interaction, client) => {
        let type = interaction.options.getString("type")
        let time = interaction.options.getString("time")

        let stat = await stats.find()
        stat = stat[0]

        let amount = 0
        let sliceMin = 0
        let sliceMax = 0

        let myChart;
        let chartData;

        if (time == "hours") {
            amount = 24
            sliceMin = 11
            sliceMax = 16
        } else if (time == "days") {
            amount = 7
            sliceMax = 10
        } else if (time == "months") {
            amount = 12
            sliceMax = 7
        } else if (time == "years") {
            amount = 10
            sliceMax = 4
        }
        let dates = []

        let e = new Date()
        e.setHours(e.getHours(), 0, 0, 0)
        const collectedData = [e.toISOString()]
        for (let i = 0; i < amount; i++) {
            collectedData.push(getPreviousDay(collectedData[i], time))
        }
        if (type == "games") {
                let timesHosted = []
                let timesCanceled = []
                let timesBeta = []

                stat.games.forEach((game) => {
                    let date = new Date(game[Object.keys(game)].time).toISOString()
                    dates.push(date)
                })
                dates.sort((date1, date2) => date2 - date1)

                let collectedData = [e.toISOString()]
                for (let i = 0; i < amount; i++) {
                    collectedData.push(getPreviousDay(collectedData[i], time))
                }
                console.log(collectedData)

                dates.forEach((date) => {
                    let found = collectedData.find((data) => compareTime(typeof data == "string" ? new Date(data) : new Date(Object.keys(data).toString()), new Date(date), time))

                    if (found) {
                        collectedData[collectedData.indexOf(found)] =
                            typeof collectedData[collectedData.indexOf(found)] == "object"
                                ? {
                                      [Object.keys(found).toString()]: parseInt(Object.values(found)) + 1,
                                  }
                                : {
                                      [found]: 1,
                                  }
                    }
                })
                dates = []
                let count = 0
                collectedData.forEach((data) => {
                    dates.push(typeof data == "object" ? Object.keys(data).toString().slice(sliceMin, sliceMax) : data.slice(sliceMin, sliceMax))
                    if (typeof data == "object") {
                        timesHosted.push(Object.values(data)[0])
                    } else {
                        timesHosted.push(0)
                    }
                    stat.games.forEach((game) => {
                        if (typeof data == "object") data = Object.keys(data).toString()
                        let f = game[Object.keys(game)].time.toISOString()
                        if (compareTime(new Date(data), new Date(f), time)) {
                            if (game[Object.keys(game)].status == "cancel") {
                                timesCanceled[count] ? timesCanceled[count]++ : (timesCanceled[count] = 1)
                            }
                            if (game[Object.keys(game)].beta) {
                                timesBeta[count] ? timesBeta[count]++ : (timesBeta[count] = 1)
                            }
                        }
                    })
                    count++
                })

                /* dates.forEach(date => {
                    if (collectedData.length != 31) {
                        let found = collectedData.find((e) => Object.keys(e).toString().slice(5, 10) == date.slice(5, 10))
                        if (found) {
                            collectedData[collectedData.indexOf(found)] = { [date]: parseInt(Object.values(found)) + 1 }
                        } else {
                            collectedData.push({ [date]: 1 })
                        }
                    }
                })
                dates = []
                collectedData.sort((date1, date2) => new Date(Object.keys(date1)) - new Date(Object.keys(date2)) )
                collectedData.forEach((e) => {
                    timesHosted.push(parseInt(Object.values(e)))
                    dates.push(Object.keys(e).toString().slice(3, 15))
                })
                */
                chartData = {
                    labels: dates,
                    datasets: [
                        {
                            label: "Total Games Hosted",
                            data: timesHosted,
                            fill: false,
                            backgroundColor: "rgb(99, 255, 132)",
                        },
                        {
                            label: "Total Games Canceled",
                            data: timesCanceled,
                            fill: false,
                            backgroundColor: "rgb(255, 99, 132)",
                        },
                        {
                            label: "Total Beta Games",
                            data: timesBeta,
                            fill: false,
                            backgroundColor: "rgb(99, 132, 255)",
                        },
                    ],
                }

                myChart = {
                    type: "bar",
                    data: chartData,
                }
            } else if (type == "members") {
                let members = stat.members
                let prevMembers = stat.previousFetch
                prevMembers.sort((date1, date2) => new Date(Object.keys(date2)) - new Date(Object.keys(date1)))
                let dateNow = new Date()
                dateNow.setHours(dateNow.getHours(), 0, 0, 0)
                let dates = [dateNow]
                let allMembers = [members]

                let memberCount = []

                prevMembers.forEach((e) => {
                    dates.push(new Date(Object.keys(e)))
                    allMembers.push(Object.values(e))
                })
                console.log(dates)
                console.log(collectedData)
                dates.forEach((date) => {
                    let found = collectedData.find((data) => compareTime(typeof data == "string" ? new Date(data) : new Date(Object.keys(data).toString()), new Date(date), time))

                    if (found) {
                        collectedData[collectedData.indexOf(found)] =
                            typeof collectedData[collectedData.indexOf(found)] == "object"
                                ? {
                                      [Object.keys(found).toString()]: parseInt(Object.values(found)) + allMembers[dates.indexOf(date)].length,
                                  }
                                : {
                                      [found]: allMembers[dates.indexOf(date)].length,
                                  }
                    }
                })

                dates = []

                collectedData.forEach((data) => {
                    dates.push(typeof data == "object" ? Object.keys(data).toString().slice(sliceMin, sliceMax) : data.slice(sliceMin, sliceMax))
                    if (typeof data == "object") {
                        memberCount.push(Object.values(data)[0])
                    } else {
                        memberCount.push(0)
                    }
                })
                chartData = {
                    labels: dates,
                    datasets: [
                        {
                            label: "Total Members",
                            data: memberCount,
                            fill: false,
                            backgroundColor: "rgb(99, 255, 132)",
                        },
                    ]
                }

                myChart = {
                    type: "line",
                    data: chartData,
                }
    }
        const image = await chartJSNodeCanvas.renderToBuffer(myChart)
        interaction.reply({
            files: [image],
        })
    },
}

function getPreviousDay(date, time) {
    date = new Date(date)
    const previous = new Date(date.getTime())
    if (time == "hours") previous.setHours(date.getHours() - 1)
    else if (time == "days") previous.setDate(date.getDate() - 1)
    else if (time == "months") previous.setMonth(date.getMonth() - 1)
    else if (time == "years") previous.setFullYear(date.getFullYear() - 1)

    return previous.toISOString()
}

function compareTime(date1, date2, time) {
    if (time == "hours") return Math.round(date1.getTime() / 3600000) == Math.round(date2.getTime() / 3600000)
    else if (time == "days") return Math.round(date1.getTime() / 86400000) == Math.round(date2.getTime() / 86400000)
    else if (time == "months") return Math.round(date1.getTime() / 2629746000) == Math.round(date2.getTime() / 2629746000)
    else if (time == "years") return Math.round(date1.getTime() / 31556952000) == Math.round(date2.getTime() / 31556952000)
}
