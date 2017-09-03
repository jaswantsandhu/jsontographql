const _ = require("lodash");
const changeCase = require("change-case");
const fs = require("fs");

let JSMODE = "";
let RESOLVES = {};
let SPLITSCHEMATOFILES = false;
let CWD = "./"
let MAPS = {};

let schemas = {},
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
        resolve = `resolve : function(obj, args, context){
            return ${RESOLVES[name].resolve}
        }`
    } else if (RESOLVES[name] === null) {
        resolve = ``
    } else {
        resolve = `resolve : function(obj, args, context)
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
                import { ${methods.join(", ")} } from '${index}';`

        } else {
            requiredItems += `
                const { ${methods.join(", ")} } = require('${index}');`;
        }

    });

    return requiredItems;
}

requiredSchemaImports = function () {

    let items = "",
        requiredItems;

    _.forEach(graphQLSchemaImports, function (item, index) {
        items += item + ","
    });

    if (JSMODE === "TS" || JSMODE === "ES6") {
        requiredItems = `import { ${items} } from 'graphql';`
    } else {
        requiredItems = `const { ${items} } = require('graphql');`;
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

    let itemType = typeof item,
        itemName = changeCase.pascalCase(name);

    if (MAPS[itemName]) {
        return `${itemName}: {
            description: 'enter dasdadasd for ${itemName}',
            type: new GraphQLNonNull(new GraphQLList(${MAPS[itemName].type})),
            ${addResolveMethod(name)}
        }`;
    }

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

            schemas[changeCase.pascalCase(itemName)] = handleObject(item, name);

            return `${name}: {
                        description: 'enter description for ${name}',
                        type: new GraphQLNonNull(${itemName}),
                        ${addResolveMethod(name)}
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
                schemas[changeCase.pascalCase(name)] = handleArray(item[0], `${name}`);

            } else if (_.isObject(item[0])) {

                ListItemType = `${name}`;
                schemas[changeCase.pascalCase(name)] = handleObject(item[0], `${name}`);

            } else if (_.isInteger(item[0])) {

                ListItemType = "GraphQLInt";

            } else if (_.isNumber(item[0])) {

                ListItemType = "GraphQLFloat";

            } else if (typeof item[0] === "string") {

                ListItemType = "GraphQLString";

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

handleObject = function (jObject, name) {
    let fields = [];

    _.forEach(jObject, (item, index) => {
        fields.push(handleDataType(item, index, name));
    })

    var itemName = `${changeCase.pascalCase(name)}`;
    var resolve = "";
    var output = `new GraphQLObjectType({
        name: '${itemName}',
        fields: {
            ${fields.join(",")}
        }
    })`

    return output;
}

writeSubSchemaFiles = function (schema, name) {
    fs
        .writeFile(CWD + name.toLowerCase() + ".js", schema, function () {
            console.log("Schema Created - " + name + " @ " + CWD + name.toLowerCase() + ".js")
        })
}

schemaToString = function (schemas) {
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

    return schemasOutput;
}

convertToSchema = function (JSON, options = {}) {

    JSMODE = options.jsMode || "";
    RESOLVES = options.resolves || {};
    SPLITSCHEMATOFILES = options.splitSchemaFiles || false;
    CWD = options.cwd || "./";
    MAPS = options.maps || {};

    if (JSON) {
        handleDataType(JSON, "Root")
    } else {
        return "Invalid JSON provided";
    }

    if (SPLITSCHEMATOFILES) {

        var pathSubSchemas = "";

        _.forEach(schemas, function (item, index) {

            if(MAPS[index])
                {
                    delete schemas[index];
                    return;
                }

            var path = `${CWD}${CWD !== "./"
                ? ""
                : "/"}${index.toLowerCase()}`;

            var pathInner = `./${index.toLowerCase()}.js`;

            if (index !== "Root") {
                if (JSMODE === "TS" || JSMODE === "ES6") {
                    pathSubSchemas += `import { ${index} }  from "${pathInner}";`
                } else {
                    pathSubSchemas += `const { ${index} }  from require("${pathInner}");`
                }
            }
        });

        _.forEach(schemas, function (item, index) {
            var itemSchema = "";
            var path = `${CWD}${CWD !== "./"
                ? ""
                : "/"}${index.toLowerCase()}`
            if (index !== "Root") {
                if (JSMODE === "TS" || JSMODE === "ES6") {
                    itemSchema = `
                        ${requiredSchemaImports()}

                        ${pathSubSchemas}

                        const ${index} = ${item};
                        export {
                            ${index}
                        };
                        
                        `
                } else {
                    itemSchema = `
                        ${pathSubSchemas}

                        const ${index} = ${item};
                        
                        module.exports = {
                            ${index}
                        };`
                }

                writeSubSchemaFiles(itemSchema, index)
            }
        });

        outputSchema = `
            ${requiredSchemaImports()}

            ${resolvePackagesImports()}

            ${pathSubSchemas}

            const Schema = new GraphQLSchema({
                query: ${schemas['Root']}
            })
            export {
                Schema
            }
            `;

        writeSubSchemaFiles(outputSchema, "schema")

    } else {
        outputSchema = `
            ${requiredSchemaImports()}
            ${resolvePackagesImports()}
            let ${Object
            .keys(schemas)
            .join(",")};
            ${schemaToString(schemas)}
            `;

        return outputSchema;
    }

}

module.exports = convertToSchema;