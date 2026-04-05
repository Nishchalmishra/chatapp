import jwt from "jsonwebtoken"
import { db } from "../database/db.js"
import { users } from "../models/users.model.js"
import { eq } from "drizzle-orm"

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie
            .split("; ")
            .find((token) => token.startsWith("accessToken="))
            .split("=")[1];
        if (!token) {
            return next(new Error("Unauthorized - No token provided"));
        }
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, decodeToken.userId));
        if (user.length === 0) {
            return next(new Error("User not found"));
        }
        socket.user = user[0];
        socket.userId = user[0].id.toString();
        // console.log("User authenticated: ", user[0].username);
        next();
    } catch (error) {
        console.log("Error while authenticating socket",error);
        return next(new Error("Unauthorized - Invalid token"));

    }
}