import { verify } from "jsonwebtoken"
import { User } from "../models/User"
import { createAccesstoken, createRefreshtoken } from "../validation/userAuth"

const refresh = async (req, res) => {
    const refreshToken = req.cookies.jid
    if (!refreshToken) return res.send({ ok: false, accessToken: '' })

    try {
        const payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findOne({ _id: payload.userId })

        if (!user) return res.send({ ok: false, accessToken: '' })

        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ ok: false, accessToken: '' })
        }

        res.cookie(
            'jid', createRefreshtoken(user),
            { httpOnly: true, sameSite: true }
        );

        return res.send({
            ok: true,
            accessToken: createAccesstoken(user)
        })
    } catch {
        return res.send({ ok: false, accessToken: '' })
    }
}

export default refresh
