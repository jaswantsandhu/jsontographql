import {
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

import
{
    invoke
}
from './lambda';

let Root,
    Event,
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
            resolve: function (obj, args, context) {
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
            resolve: function (obj, args, context) {
                // resolve handler.
            }
        }
    }
});

const Schema = new GraphQLSchema({
    query: new GraphQLObjectType1({
        name: 'Root',
        fields: {
            Event: {
                description: 'enter description for Event',
                type: new GraphQLNonNull(Event),
                resolve: function (obj, args, context) {
                    return invoke({FunctionName: "getEvent"})
                }
            },
            Events: {
                description: 'enter description for Events',
                type: new GraphQLNonNull(new GraphQLList(Events)),
                resolve: function (obj, args, context) {
                    return invoke({FunctionName: "getEvents"})
                }
            },
            Templates: {
                description: 'enter description for Templates',
                type: new GraphQLNonNull(new GraphQLList(Templates)),
                resolve: function (obj, args, context) {
                    // resolve handler.
                }
            }
        }
    })
})
export {Schema};
