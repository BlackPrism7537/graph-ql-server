import { hash, compare } from 'bcryptjs'

import { User } from "../models/User";
import { createAccesstoken, createRefreshtoken, tokenValidation } from '../validation/userAuth';
import { uniqueUser } from '../validation/userValidation'

export const resolvers = {
    Query: {
        hello: () => 'hi',

        auth: async (_, __, context) => {
            return await tokenValidation(context)
        },

        user: async (_, { email }) => {
            const user = await User.findOne({ email });
            return user;
        },

        users: async () => {
            const users = await User.find();
            return users;
        }
    },

    Mutation: {
        register: async (_, { email, password, firstname, lastname }) => {
            const valid = await uniqueUser(email);
            if (!valid) return false;

            const hashedPass = await hash(password, 10);
            const user = new User({ email, password: hashedPass, firstname, lastname })
            user.save()

            return true;
        },

        login: async (_, { email, password }, { res }) => {
            const user = await User.findOne({ email });

            if (!user) return { accessToken: null, error: 'Login Error!' };

            const valid = await compare(password, user.password);
            if (!valid) return { accessToken: null, error: 'Login Error!' };

            res.cookie(
                'jid', createRefreshtoken(user),
                { httpOnly: true }
            );

            return {
                accessToken: createAccesstoken(user),
                error: null
            };

        },

        logout: async (_, __, { res }) => {
            res.clearCookie('jid');
            return true;
        },

        incrementTokenVersion: async (_, { id }) => {
            const user = await User.findById(id);
            if (!user) return false;

            user.tokenVersion += 1;
            user.save();

            return true;
        }
    }
}
