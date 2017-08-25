
        
        
        const {
            GraphQLSchema, GraphQLNonNull, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt, 
        } = require('graphql');

        let Root,Events,Tickets,seats,address,Users,Tickets

        address = new GraphQLObjectType({
        name: 'address',
        fields: {
            line1: {
                        description: 'enter description for line1',
                        type: new GraphQLNonNull(GraphQLString)
                    },line2: {
                        description: 'enter description for line2',
                        type: new GraphQLNonNull(GraphQLString)
                    }
        }
    });

Tickets = new GraphQLObjectType({
        name: 'Tickets',
        fields: {
            name: {
                        description: 'enter description for name',
                        type: new GraphQLNonNull(GraphQLString)
                    },seats: {
                        description: 'enter description for seats',
                        type: new GraphQLNonNull(new GraphQLList(GraphQLInt)),
                        resolve : function()
                            {
                                // resolve handler.
                            }
                    },address: {
                        description: 'enter description for address',
                        type: new GraphQLNonNull(address)
                    }
        }
    });

Events = new GraphQLObjectType({
        name: 'Events',
        fields: {
            Tickets: {
                        description: 'enter description for Tickets',
                        type: new GraphQLNonNull(Tickets)
                    }
        }
    });

Users = new GraphQLObjectType({
        name: 'Users',
        fields: {
            name: {
                        description: 'enter description for name',
                        type: new GraphQLNonNull(GraphQLString)
                    },id: {
                        description: 'enter description for id',
                        type: new GraphQLNonNull(GraphQLInt)
                    }
        }
    });

module.exports = new GraphQLSchema({
                    query: new GraphQLObjectType({
        name: 'Root',
        fields: {
            Events: {
                        description: 'enter description for Events',
                        type: new GraphQLNonNull(new GraphQLList(Events)),
                        resolve : function()
                            {
                                // resolve handler.
                            }
                    },Users: {
                        description: 'enter description for Users',
                        type: new GraphQLNonNull(new GraphQLList(Users)),
                        resolve : function()
                            {
                                // resolve handler.
                            }
                    },Tickets: {
                        description: 'enter description for Tickets',
                        type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
                        resolve : function()
                            {
                                // resolve handler.
                            }
                    }
        }
    })
                })
        
    
        