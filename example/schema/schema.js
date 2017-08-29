import {
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

import {invoke} from './lambda';

import {Event} from "./schema/event";
import {Events} from "./schema/events";
import {Templates} from "./schema/templates";

const Schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Root',
        fields: {
            Event: {
                description: 'enter description for Event',
                type: new GraphQLNonNull(Event)
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
                type: new GraphQLNonNull(new GraphQLList(Templates))
            }
        }
    })
})
export {Schema}
