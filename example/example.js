const {convertToSchema} = require("../index"); // changes to json-to-graphql-schema
const fs = require("fs");
const output = convertToSchema({
    Users : [
        {
            name : "ABC",
            team : "XYZ",
            contactNo : {
                mobile : "3133122212"
            },
            age : 32
        }
    ]
});
fs.writeFile("sample.js", output);