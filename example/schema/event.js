import {
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

import {Event} from "./schema/event";
import {Events} from "./schema/events";
import {Templates} from "./schema/templates";

const Event = GraphQLObjectType({
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
export {Event};
