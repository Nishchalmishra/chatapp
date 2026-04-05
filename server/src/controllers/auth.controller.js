import { asyncHandler } from "../lib/utils/asyncHandler.js";
import { ApiResponse } from "../lib/utils/apiResponse.js";
import { ApiError } from "../lib/utils/apiError.js";
import { db } from "../database/db.js";
import { users } from "../models/users.model.js";
import {
    hashPassword,
    generateAccessToken,
    generateRefreshToken,
    comparePassword,
} from "../lib/services/auth.service.js";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "../lib/emails/emailHandler.js";
import dotenv from "dotenv";
import cloudinary from "../lib/utils/cloudinary.js";

dotenv.config({quiet: true})

export const userSignUp = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        throw new ApiError(400, "All fields are required");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }

    try {
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (existingUser.length > 0) {
            throw new ApiError(400, "Email already exists");
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await db
            .insert(users)
            .values({ email, username, password: hashedPassword })
            .returning();

        if (newUser.length > 0) {
            
            const accessToken = await generateAccessToken(newUser[0].id, email);

            const refreshToken = await generateRefreshToken(newUser[0].id, email);

            // const token = request.server.jwt.sign({ id: newUser[0].id, email });

            const options = {
                httpOnly: true,
                secure: true,
            };

            newUser[0].refreshToken = refreshToken;

            try {
                await sendWelcomeEmail(newUser[0].email, newUser[0].username);
            } catch (error) {
                console.log(error);
            }

            const sendUser = await db.select({
                id: users.id,
                username: users.username,
                email: users.email,
                avatar: users.avatar,
            }).from(users).where(eq(users.id, newUser[0].id))
            
            res
                .status(201)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(
                    new ApiResponse(201, "User created successfully", {
                        sendUser,
                    }),
            );

            

            // reply
            //     .code(201)
            //     .cookie("accessToken", token, options)
            //     .send(new ApiResponse(201, "User created successfully", { newUser }));


        } else {

            res.status(500).json({ message: "Something went wrong while doing db call" });

            // reply.code(500).send({ message: "Something went wrong while doing db call" });

        }
    } catch (error) {

        res.status(500).json({ message: "Something went wrong while signing up", error: error.message });

        // reply.c/ode(500).send({ message: "Something went wrong while signing up", error: error.message });

    }
});

export const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    try {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (user.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await comparePassword(password, user[0].password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const accessToken = await generateAccessToken(user[0].id, email);

        const refreshToken = await generateRefreshToken(user[0].id, email);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        user[0].refreshToken = refreshToken;

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, "User logged in successfully", { user }));

        // reply
        //     .code(200)
        //     .cookie("accessToken", token, options)
        //     .send(new ApiResponse(200, "User logged in successfully", { user }));

    } catch (error) {
        res.status(500).json({ message: "Something went wrong while logging in", error: error.message });
        // reply.code(500).send({ message: "Something went wrong while logging in", error: error.message });
    }
});

export const userLogout = asyncHandler(async (_, res) => {
    const options = {
        httpOnly: true,
        secure: true,
    };

    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out successfully", null));
    // reply
    //     .code(200)
    //     .clearCookie("accessToken", options)
    //     .clearCookie("refreshToken", options)
    //     .send(new ApiResponse(200, "User logged out successfully", null));
});

export const userUpdate = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const avatar = req.file;
    
    if (!avatar) {
        return res.status(400).json({ message: "Avatar is required" });
    }

    const uploadAvatar = await cloudinary.uploader.upload(avatar.path); 
    
    try {
        const updatedUser = await db
            .update(users)
            .set({ avatar: String(uploadAvatar.secure_url) })
            .where(eq(users.id, userId))
            .returning();
    
        res.status(200).json(new ApiResponse(200, "Avatar updated successfully", { updatedUser }));
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while updating avatar", error: error.message });
    }

});

