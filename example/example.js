const {convertToSchema} = require("../index");
const fs = require("fs");
const output = convertToSchema({
    Events: [
        {
            Tickets: {
                name: "Ticket 1",
                seats: [
                    23,
                    324,
                    34,
                    312,
                    312,
                    3213,
                    312
                ],
                address: {
                    line1: "",
                    line2: ""
                }
            }
        }
    ],
    Users: [
        {
            name: "ABC",
            id: 1
        }
    ],
    Tickets: ["1"]
});

fs.writeFile("./sample.js", output, function () {
    console.log("schema file created.")
});