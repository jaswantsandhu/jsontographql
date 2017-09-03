const {
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require('graphql');

const {Event} = require("./event.js");
const {Templates} = require("./templates.js");

const Templates = new GraphQLObjectType({
    name: 'Templates',
    fields: {
        id: {
            description: 'enter description for id',
            type: new GraphQLNonNull(GraphQLInt)
        },
        name: {
            description: 'enter description for name',
            type: new GraphQLNonNull(GraphQLString)
        },
        Event: {
            description: 'enter description for Event',
            type: new GraphQLNonNull(new GraphQLList(Event))
        }
    }
});

module.exports = {
    Templates
};