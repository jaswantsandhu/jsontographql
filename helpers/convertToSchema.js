const _ = require("lodash");

let schemaVariables = [],
    schemas = {},
    graphQLSchemaImports = {
        schema: "GraphQLSchema",
        notnull: "GraphQLNonNull"
    },
    schema = "";

let addSchemaImport,
    requiredSchemaImports,
    createRootSchema,
    handleString,
    handleArray,
    handleObject,
    convertToSchema

requiredSchemaImports = function () {
    let items = "";
    _.forEach(graphQLSchemaImports, function (item, index) {
        items += item + ", "
    });

    let requiredItems = `
        const {
            ${items}
        } = require('graphql');`;

    return requiredItems;
}

createRootSchema = function () {}

handleArray = function (jArray, name) {
    let fields = [];

    fields.push(handleDataType(jArray[0], name));

    return `${name} = new GraphQLList({
        name: '${name}',
        fields: {
            ${fields.join(",")}
        },
        resolve : function(parent, args, context)
            {
                // resolve handler.
            }
    });`
}

handleDataType = function (item, name, parent) {

    let itemType = typeof item;

    if (_.isArray(item)) {
        itemType = "array";
    } else if (_.isObject(item)) {
        itemType = "object";
    } else if (_.isInteger(item)) {
        itemType = "int";
    } else if (_.isNumber(item)) {
        itemType = "float";
    }

    switch (itemType) {

        case "object":
            graphQLSchemaImports["object"] = "GraphQLObjectType";

            var itemName = `${name}`,
                useParent = false;
            if (schemas[`${name}`]) {
                itemName = `${name}${parent}`;
                useParent = true;
            }

            schemaVariables.push(itemName);
            schemas[itemName] = handleObject(item, name, parent, useParent);

            return `${name}: {
                        description: 'enter description for ${name}',
                        type: new GraphQLNonNull(${itemName})
                    }`
            break;

        case "array":
            graphQLSchemaImports["array"] = "GraphQLList";

            var ListItemType = typeof item[0];

            if (_.isArray(item[0])) {
                ListItemType = `${name}`;
                schemaVariables.push(`${name}`);
                schemas[`${name}`] = handleArray(item[0], `${name}`);
            } else if (_.isObject(item[0])) {
                ListItemType = `${name}`;
                schemaVariables.push(`${name}`);
                schemas[`${name}`] = handleObject(item[0], `${name}`);
            } else if (_.isInteger(item[0])) {
                ListItemType = "GraphQLInt";
                schemaVariables.push(`${name}`);
            } else if (_.isNumber(item[0])) {
                ListItemType = "GraphQLFloat";
                schemaVariables.push(`${name}`);
            }

            console.log(ListItemType, item[0], "ItemType");

            return `${name}: {
                        description: 'enter description for ${name}',
                        type: new GraphQLNonNull(new GraphQLList(${ListItemType}))
                    }`
            break;

        case "string":
            graphQLSchemaImports["string"] = "GraphQLString";
            return `${name}: {
                        description: 'enter description for ${name}',
                        type: new GraphQLNonNull(GraphQLString)
                    }`
            break;
        case "float":
            graphQLSchemaImports["float"] = "GraphQLFloat";
            return `${name}: {
                        description: 'enter description for ${name}',
                        type: new GraphQLNonNull(GraphQLFloat)
                    }`
            break;
        case "int":
            graphQLSchemaImports["int"] = "GraphQLInt";
            return `${name}: {
                        description: 'enter description for ${name}',
                        type: new GraphQLNonNull(GraphQLInt)
                    }`
            break;
        case "boolean":
            graphQLSchemaImports["boolean"] = "GraphQLBoolean";
            return `${name}: {
                        description: 'enter description for ${name}',
                        type: new GraphQLNonNull(GraphQLBoolean)
                    }`
            break;
    }
}

handleObject = function (jObject, name, parent, useParent) {
    let fields = [];
    _.forEach(jObject, (item, index) => {
        fields.push(handleDataType(item, index, name));
    })

    var itemName = `${name}`

    if (useParent) {
        itemName = `${name}${parent}`;
    }

    return `GraphQLObjectType({
        name: '${itemName}',
        fields: {
            ${fields.join(",")}
        },
        resolve : function(parent, args, context)
            {
                // resolve handler.
            }
    })`
}

convertToSchema = function (JSON, options) {

    if (JSON) {
        handleDataType(JSON, "Root")
    } else {
        return "Invalid JSON provided";
    }

    let schemasOutput = "";

    _.forEach(schemas, function (item, index) {

        if (index === "Root") {
            schemasOutput += `module.exports = new GraphQLSchema({
                    query: new ${item}
                })`
        } else {
            schemasOutput += `${index} = new ${item};` + "\n\n";
        }

    })

    let outputSchema = `
        
        ${requiredSchemaImports()}

        let ${schemaVariables.join(",")}

        ${schemasOutput}
        
    
        `;

    return outputSchema;
}

module.exports = convertToSchema;