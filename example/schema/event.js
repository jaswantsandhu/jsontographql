import {
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

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
