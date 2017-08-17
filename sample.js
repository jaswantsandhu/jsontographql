const {
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLInt
} = require('graphql');

let Root,
    Users,
    contactNo

contactNo = new GraphQLObjectType({
    name: 'contactNo',
    fields: {
        mobile: {
            description: 'enter description for mobile',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: function (parent, args, context) {
        // resolve handler.
    }
});

Users = new GraphQLObjectType({
    name: 'Users',
    fields: {
        name: {
            description: 'enter description for name',
            type: new GraphQLNonNull(GraphQLString)
        },
        team: {
            description: 'enter description for team',
            type: new GraphQLNonNull(GraphQLString)
        },
        contactNo: {
            description: 'enter description for contactNo',
            type: new GraphQLNonNull(contactNo)
        },
        age: {
            description: 'enter description for age',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: function (parent, args, context) {
        // resolve handler.
    }
});

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Root',
        fields: {
            Users: {
                description: 'enter description for Users',
                type: new GraphQLNonNull(new GraphQLList(Users))
            }
        },
        resolve: function (parent, args, context) {
            // resolve handler.
        }
    })
})
