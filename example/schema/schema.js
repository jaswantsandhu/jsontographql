
            import { GraphQLSchema,GraphQLNonNull,GraphQLObjectType,GraphQLInt,GraphQLString,GraphQLList, } from 'graphql';

            
                import { invoke } from './lambda';

            import { Event }  from "./event.js";import { Templates }  from "./templates.js";

            const Schema = new GraphQLSchema({
                query: new new GraphQLObjectType({
        name: 'Root',
        fields: {
            Event: {
                        description: 'enter description for Event',
                        type: new GraphQLNonNull(Event),
                        
                    },Events: {
            description: 'enter dasdadasd for Events',
            type: new GraphQLNonNull(new GraphQLList(Event)),
            resolve : function(obj, args, context){
            return invoke({FunctionName : "getEvents"})
        }
        },Templates: {
                        description: 'enter description for Templates',
                        type: new GraphQLNonNull(new GraphQLList(Templates)),
                        
                    }
        }
    })
            })
            export {
                Schema
            }
            