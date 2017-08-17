const {GraphQLSchema, GraphQLNonNull, GraphQLObjectType, GraphQLList, GraphQLString} = require('graphql');

let Root,
    Events,
    Tickets,
    seats

Tickets = new GraphQLObjectType({
    name: 'Tickets',
    fields: {
        name: {
            description: 'enter description for name',
            type: new GraphQLNonNull(GraphQLString)
        },
        seats: {
            description: 'enter description for seats',
            type: new GraphQLNonNull(new GraphQLList(GraphQLInt))
        }
    },
    resolve: function (parent, args, context) {
        // resolve handler.
    }
});

Events = new GraphQLObjectType({
    name: 'Events',
    fields: {
        Tickets: {
            description: 'enter description for Tickets',
            type: new GraphQLNonNull(Tickets)
        }
    },
    resolve: function (parent, args, context) {
        // resolve handler.
    }
});

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Root',
        fields: {
            Events: {
                description: 'enter description for Events',
                type: new GraphQLNonNull(new GraphQLList(Events))
            }
        },
        resolve: function (parent, args, context) {
            // resolve handler.
        }
    })
})
