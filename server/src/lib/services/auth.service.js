import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}

export const generateAccessToken = async (userId, email) => {
    return jwt.sign(
        { userId, email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d", }
    );
}

export const generateRefreshToken = async(userId, email) => {
    return jwt.sign(
        { userId, email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )
}