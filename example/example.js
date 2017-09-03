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
            Event: [
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
            Event: [
                {
                    id: 1,
                    name: "Some Slide"
                }
            ]
        }
    ]
}

// Create files and splits thems.
convertToSchema(schemaJSON, {
    splitSchemaFiles: true,
    cwd: "./schema/",
    maps: {
        Events: {
            type: "Event",
            isList: true
        }
    },
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
