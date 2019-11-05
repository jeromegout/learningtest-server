const { gql } = require("apollo-server");

const Schema = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Query {
    users: [User!]!
    login(nameOrEmail: String!, password: String!): User
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  type Mutation {
    register(input: UserInput!): User
  }
`;

module.exports = Schema;
