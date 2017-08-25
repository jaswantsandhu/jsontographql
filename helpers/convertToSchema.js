const _ = require("lodash");
const changeCase = require("change-case");

let JSMODE = "";
let RESOLVES = {};

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
    convertToSchema,
    addResolveMethod,
    resolvePackagesImports,
    resolvePackages = {};

addResolveMethod = function (name) {
    let resolve = "";
    if (RESOLVES[name]) {
        resolve = `resolve : function(context, event, args){
            return ${RESOLVES[name].resolve}
        }`
    } else {
        resolve = `resolve : function()
                {
                    // resolve handler.
                }`
    }

    if (RESOLVES[name] && RESOLVES[name].package) {
        if (!resolvePackages[RESOLVES[name].package]) {
            resolvePackages[RESOLVES[name].package] = {};
        }
        resolvePackages[RESOLVES[name].package][RESOLVES[name].method] = RESOLVES[name].default || false;
    }

    return resolve;
}

resolvePackagesImports = function () {

    let items = "",
        requiredItems = "";

    _.forEach(resolvePackages, function (item, index) {

        var methods = [];

        _.forEach(item, function (method, methodIndex) {
            methods.push(methodIndex);
        })

        if (JSMODE === "TS" || JSMODE === "ES6") {

            requiredItems += `
                import 
                    {
                        ${methods.join(", ")}
                    } 
                from '${index}';`

        } else {
            requiredItems += `
                const {
                    ${methods.join(", ")}
                } = require('${index}');`;
        }

    });

    return requiredItems;
}

requiredSchemaImports = function () {

    let items = "",
        requiredItems;

    _.forEach(graphQLSchemaImports, function (item, index) {
        items += item + ", "
    });

    if (JSMODE === "TS" || JSMODE === "ES6") {
        requiredItems = `
                import {
                    ${items}
                } from 'graphql';`
    } else {
        requiredItems = `
                const {
                    ${items}
                } = require('graphql');`;
    }

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
        ${addResolveMethod(name)}
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
            graphQLSchemaImports["object"] = "GraphQLObjectType2";

            var itemName = changeCase.pascalCase(name),
                useParent = false;

            if (schemas[`${name}`]) {
                itemName = `${changeCase.pascalCase(name)}${parent}`;
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

            if (ListItemType === "undefined") {
                return "";
            }

            if (_.isArray(item[0])) {

                ListItemType = `${name}`;
                schemaVariables.push(`${changeCase.pascalCase(name)}`);
                schemas[name] = handleArray(item[0], `${name}`);

            } else if (_.isObject(item[0])) {

                ListItemType = `${name}`;
                schemaVariables.push(`${changeCase.pascalCase(name)}`);
                schemas[name] = handleObject(item[0], `${name}`);

            } else if (_.isInteger(item[0])) {

                ListItemType = "GraphQLInt";
                schemaVariables.push(`${changeCase.pascalCase(name)}`);

            } else if (_.isNumber(item[0])) {

                ListItemType = "GraphQLFloat";
                schemaVariables.push(`${changeCase.pascalCase(name)}`);

            } else if (typeof item[0] === "string") {

                ListItemType = "GraphQLString";
                schemaVariables.push(`${changeCase.pascalCase(name)}`);

            }

            return `${name}: {
                        description: 'enter description for ${name}',
                        type: new GraphQLNonNull(new GraphQLList(${changeCase.pascalCase(ListItemType)})),
                        ${addResolveMethod(name)}
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

    var itemName = `${changeCase.pascalCase(name)}`

    if (useParent) {
        itemName = `${changeCase.pascalCase(name)}${parent}`;
    }

    var resolve = ""

    var output = `GraphQLObjectType1({
        name: '${itemName}',
        fields: {
            ${fields.join(",")}
        }
    })`

    return output;
}

convertToSchema = function (JSON, options = {}) {

    JSMODE = options.jsMode || "";
    RESOLVES = options.resolves || {};

    if (JSON) {
        handleDataType(JSON, "Root")
    } else {
        return "Invalid JSON provided";
    }

    let schemasOutput = "";

    _.forEach(schemas, function (item, index) {

        if (index === "Root") {

            if (JSMODE === "TS" || JSMODE === "ES6") {
                schemasOutput += `const Schema = new GraphQLSchema({
                        query: new ${item}
                    })
                    
                    export {
                        Schema
                    };

                    `;
            } else {
                schemasOutput += `module.exports = new GraphQLSchema({
                        query: new ${item}
                    });`;
            }

        } else {
            schemasOutput += `${changeCase.pascalCase(index)} = new ${item};` + "\n\n";
        }

    })

    console.log(resolvePackages);

    let outputSchema = `
        
        ${requiredSchemaImports()}

        ${resolvePackagesImports()}

        let ${schemaVariables.join(",")};

        ${schemasOutput}
        `;

    return outputSchema;
}

module.exports = convertToSchema;