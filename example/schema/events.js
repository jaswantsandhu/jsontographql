import {
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

import {Event} from "./event.js";
import {Events} from "./events.js";
import {Templates} from "./templates.js";

const Events = GraphQLObjectType({
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
        Event: {
            description: 'enter description for Event',
            type: new GraphQLNonNull(new GraphQLList(Event))
        }
    }
});
export {Events};
