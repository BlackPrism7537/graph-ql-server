import { sign, verify } from "jsonwebtoken";
import { User } from '../models/User'

export const createAccesstoken = (user) => {
    const payload = sign(
        {
            userId: user._id,
            tokenVersion: user.tokenVersion
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
    return payload;
};

export const createRefreshtoken = (user) => {
    const payload = sign(
        {
            userId: user._id,
            tokenVersion: user.tokenVersion
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    return payload;
}

export const tokenValidation = async (context) => {
    const authorization = context.req.headers['authorization']


    if (!authorization) return false;

    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(payload.userId)
        context.userId = user.id

        return { ok: true, user: user, error: null }
    } catch (err) {
        return { ok: false, user: null, error: err }
    }

}