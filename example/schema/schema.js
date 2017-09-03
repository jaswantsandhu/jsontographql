const {
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require('graphql');

const {invoke} = require('./lambda');

const {Event} = require("./event.js");
const {Templates} = require("./templates.js");

const Schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Root',
        fields: {
            Event: {
                description: 'enter description for Event',
                type: new GraphQLNonNull(Event)
            },
            Events: {
                description: 'enter dasdadasd for Events',
                type: new GraphQLNonNull(new GraphQLList(Event)),
                resolve: function (obj, args, context) {
                    return invoke({FunctionName: "getEvents"})
                }
            },
            Templates: {
                description: 'enter description for Templates',
                type: new GraphQLNonNull(new GraphQLList(Templates))
            }
        }
    })
})
export {Schema}
