import {
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

const Templates = GraphQLObjectType({
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
            type: new GraphQLNonNull(new GraphQLList(Event))
        }
    }
});
export {Templates};
