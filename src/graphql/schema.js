const { gql } = require("apollo-server");

const Schema = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
    avatar: String!
  }

  type AuthData {
    userName: String
    userAvatar: String
    token: String
  }

  input ConnectionInput {
    email: String!
    password: String!
  }

  input UserInput {
    name: String
    email: String
    avatar: String
  }

  type Query {
    users: [User!]!
    login(input: ConnectionInput): AuthData
    me: User!
  }

  type Mutation {
    registerUser(input: ConnectionInput!): User
    updateUser(userId: ID!, input: UserInput!): User
  }
`;

module.exports = Schema;
