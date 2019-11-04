const { gql } = require('apollo-server');

const Schema = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Query {
    users: [User!]
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  type Mutation {
    signIn(input: UserInput!): User
  }
`;

module.exports = Schema;