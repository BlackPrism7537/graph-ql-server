import { verify } from "jsonwebtoken";
import { User } from "../models/User"

export const uniqueUser = async (email) => {
    const users = await User.find({ email })
    if (users.length > 0) return false;

    return true
}

