import { db } from "../database/db.js";
import { users } from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../lib/utils/asyncHandler.js";
import {eq} from "drizzle-orm"

export const protectedRoute = asyncHandler(async (req, res, next) => {

    const token = req.cookies.accessToken; 

    if(!token) {
        return res
            .status(401)
            .json({ message: "Unauthorized - No token provided" });
    }

    try {
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, decodeToken.userId));
        
        // console.log(decodeToken)

        // console.log("user: ",user)
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user[0];

        next(); 
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }

})