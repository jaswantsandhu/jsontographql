import {
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLObjectType2,
    GraphQLList,
    GraphQLInt,
    GraphQLString
} from 'graphql';

let Root,
    Events,
    Event,
    Templates,
    Event;

Event = new GraphQLObjectType1({
    name: 'Event',
    fields: {
        id: {
            description: 'enter description for id',
            type: new GraphQLNonNull(GraphQLInt)
        }
    }
});

Events = new GraphQLObjectType1({
    name: 'Events',
    fields: {
        id: {
            description: 'enter description for id',
            type: new GraphQLNonNull(GraphQLInt)
        },
        name: {
            description: 'enter description for name',
            type: new GraphQLNonNull(GraphQLString)
        },
        event: {
            description: 'enter description for event',
            type: new GraphQLNonNull(new GraphQLList(Event)),
            resolve: function () {
                // resolve handler.
            }
        }
    }
});

Templates = new GraphQLObjectType1({
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
        event: {
            description: 'enter description for event',
            type: new GraphQLNonNull(new GraphQLList(Event)),
            resolve: function () {
                // resolve handler.
            }
        }
    }
});

const Schema = new GraphQLSchema({
    query: new GraphQLObjectType1({
        name: 'Root',
        fields: {
            Events: {
                description: 'enter description for Events',
                type: new GraphQLNonNull(new GraphQLList(Events)),
                resolve: function () {
                    // resolve handler.
                }
            },
            Templates: {
                description: 'enter description for Templates',
                type: new GraphQLNonNull(new GraphQLList(Templates)),
                resolve: function () {
                    // resolve handler.
                }
            }
        }
    })
})

export {Schema};
