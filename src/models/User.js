import { model } from 'mongoose';

export const User = model(
    "User",
    {
        id: String,
        email: String,
        password: String,
        firstname: String,
        lastname: String,
        tokenVersion: {
            type: Number,
            default: 0
        },
    }
);
