const {convertToSchema} = require("../index"); // changes to json-to-graphql-schema
const fs = require("fs");
const output = convertToSchema({
    Events : [
        {
            Tickets : {
                name : "Ticket 1",
                seats : [313,131,31,313,131,331,31,3,13,13,1312]
            }
        }
    ]
});
fs.writeFile("./example/sample.js", output, function(){});