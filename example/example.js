const {convertToSchema} = require("../index");
const fs = require("fs");
const schemaJSON = {
    Event: {
        id: 1,
        name: "Some Slide"
    },
    Events: [
        {
            id: 1,
            name: "VIP Event",
            event: [
                {
                    id: 1,
                    name: "Some Slide"
                }
            ]
        }
    ],
    Templates: [
        {
            id: 1,
            name: "Template 1",
            event: [
                {
                    id: 1,
                    name: "Some Slide"
                }
            ]
        }
    ]
}
// Output as string
const output = convertToSchema(schemaJSON, {
    jsMode: "TS",
    resolves: {
        Events: {
            resolve: `invoke({FunctionName : "getEvents"})`,
            package: "./lambda",
            method: "invoke",
            default: false
        },
        Event: {
            resolve: `invoke({FunctionName : "getEvent"})`,
            package: "./lambda",
            method: "invoke",
            default: false
        }
    }
});

fs.writeFile("./sample.js", output, function () {
    console.log("schema file created.")
});

// Create files and splits thems.
convertToSchema(schemaJSON, {
    splitSchemaFiles: true,
    cwd: "./schema/",
    jsMode: "TS",
    resolves: {
        Events: {
            resolve: `invoke({FunctionName : "getEvents"})`,
            package: "./lambda",
            method: "invoke",
            default: false
        },
        Event: null,
        Templates: null,
        event: null
    }
});
