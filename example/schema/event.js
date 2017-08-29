
                        import { GraphQLSchema,GraphQLNonNull,GraphQLObjectType,GraphQLInt,GraphQLString,GraphQLList, } from 'graphql';

                        import { Event }  from "./event.js";import { Events }  from "./events.js";import { Templates }  from "./templates.js";

                        const Event = GraphQLObjectType({
        name: 'Event',
        fields: {
            id: {
                        description: 'enter description for id',
                        type: new GraphQLNonNull(GraphQLInt)
                    },name: {
                        description: 'enter description for name',
                        type: new GraphQLNonNull(GraphQLString)
                    }
        }
    });
                        export {
                            Event
                        };
                        
                        