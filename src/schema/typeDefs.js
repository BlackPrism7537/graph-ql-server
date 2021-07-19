import { gql } from "apollo-server-express";

export const typeDefs = gql`
    type User {
        _id: ID!,
        email: String!,
        password: String!,
        firstname: String!,
        lastname: String!,
        tokenVersion: Int!
    }

    type LoginResponse {
        accessToken: String,
        error: String
    }

    type AuthResponse {
        ok: Boolean!,
        user: User,
        error: String
    }

    type Query {
        hello: String!,
        auth: AuthResponse!,
        user(email: String!): User,
        users: [User!]!
    }

    type Mutation {
        register(email: String!, password: String!, firstname: String!, lastname: String!): Boolean!
        login(email: String!, password: String!): LoginResponse!
        logout: Boolean!
        incrementTokenVersion(id: String!): Boolean!
    }
`;