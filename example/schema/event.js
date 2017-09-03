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

const Event = new GraphQLObjectType({
    name: 'Event',
    fields: {
        id: {
            description: 'enter description for id',
            type: new GraphQLNonNull(GraphQLInt)
        },
        name: {
            description: 'enter description for name',
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

module.exports = {
    Event
};