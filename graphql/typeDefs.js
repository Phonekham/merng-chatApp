const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    username: String!
    email: String!
    password: String!
    token: String
    createdAt: String!
  }

  type Query {
    getUsers: [User]!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    login(username: String!, password: String!): User!
  }
`;
