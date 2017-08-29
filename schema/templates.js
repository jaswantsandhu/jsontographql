
                        import { GraphQLSchema,GraphQLNonNull,GraphQLObjectType,GraphQLInt,GraphQLString,GraphQLList, } from 'graphql';

                        import { Event }  from "./schema/event";import { Events }  from "./schema/events";import { Templates }  from "./schema/templates";

                        const Templates = GraphQLObjectType({
        name: 'Templates',
        fields: {
            id: {
                        description: 'enter description for id',
                        type: new GraphQLNonNull(GraphQLInt)
                    },name: {
                        description: 'enter description for name',
                        type: new GraphQLNonNull(GraphQLString)
                    },Event: {
                        description: 'enter description for Event',
                        type: new GraphQLNonNull(new GraphQLList(Event)),
                        
                    }
        }
    });
                        export {
                            Templates
                        };
                        
                        