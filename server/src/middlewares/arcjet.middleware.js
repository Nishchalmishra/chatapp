import { aj } from "../lib/utils/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
import { ApiResponse } from "../lib/utils/apiResponse.js";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);

        if (decision.isDenied()) {

            if(decision.reason.isRateLimit()) {
                return res.status(429).json(new ApiResponse(429, "Rate limit exceeded", null));
            }

            // else if (decision.reason.isBot()) {
            //     return res.status(403).json(new ApiResponse(403, "Bot Access denied", null));
            // }
                
            // else {
            //     return res.status(403).json(new ApiResponse(403, "Access denied", null));
            // }
        }

        if (isSpoofedBot(req)) {
            return res.status(403).json(new ApiResponse(403, "Access denied", null));
        }

        next();
        
    } catch (error) {
        console.log("arcjet error",error);
        next()
    }
};