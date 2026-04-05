import { asyncHandler } from "../lib/utils/asyncHandler.js";
import { db } from "../database/db.js";
import { eq, ne, or, and , inArray} from "drizzle-orm";
import { users } from "../models/users.model.js";
import {messageTable} from "../models/message.model.js"
import cloudinary from "../lib/utils/cloudinary.js";
import chalk from "chalk";
import { getRecipientSocketId, io } from "../lib/utils/socket.js";

export const getAllContacts = asyncHandler(async (req, res) => {
    // console.log("req.user: ",req.user)
    try {
        const loggedInUserId = req.user.id
        // extract all users except userId one
        const filteredUser = await db.select({
            id: users.id,
            username: users.username,
            avatar: users.avatar,
            email: users.email
        }).from(users).where(ne(users.id, loggedInUserId))

        return res.status(200).json(filteredUser)
       
    } catch (error) {
        console.log(chalk.red("Error while getting all contacts: "), error)
        return res.status(500).json({ message: "Something went wrong while getting all contacts", error: error.message });
    }
})

export const getChatByUserId = asyncHandler(async (req, res) => {
    try {
        const myId = req.user.id
        const { id: userToChatId } = req.params
        
        const messages = await db
            .select()
            .from(messageTable)
            .where(
                or(
                    and(
                        eq(messageTable.senderId, myId),
                        eq(messageTable.receiverId, userToChatId),
                    ),
                    and(
                        eq(messageTable.senderId, userToChatId),
                        eq(messageTable.receiverId, myId),
                    ),
                ),
            );

        return res.status(200).json(messages)

    } catch (error) {
        console.log(chalk.red("Error while getting chats: "), error)
        return res.status(500).json({ message: "Something went wrong while getting chats", error: error.message});
    }
})

export const sendMessage = asyncHandler(async (req, res) => {


    // console.log(req.user)
    try {

        const {id:senderId} = req.user

        // console.log("senderId: ",senderId)
        const { id: userToChatId } = req.params

        const { image, message } = req.body

        let imageUrl 
        if (image) {
            const uploadImage = await cloudinary.uploader.upload(image)
            imageUrl = uploadImage.secure_url
        }

        console.log(userToChatId)
        const newMessage = await db.insert(messageTable).values({
            senderId: senderId,
            receiverId: userToChatId,
            message,
            image: imageUrl
        }).returning()

        const receiverSocketId = getRecipientSocketId(String(userToChatId))
        console.log("receiverSocketId: ",receiverSocketId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage[0])
            console.log("EMITTING to:", receiverSocketId);
        }

        return res.status(200).json(newMessage)
        
    } catch (error) {
        console.log(chalk.red("Error while sending message: "), error)
        return res.status(500).json({ message: "Something went wrong while sending message", error: error.message});
    }
})

export const getChatPartners = asyncHandler(async (req, res) => {
    const { id: userId } = req.user
    
    try {
        
        const messages = await db
            .select()
            .from(messageTable)
            .where(
                or(
                    eq(messageTable.senderId, userId),
                    eq(messageTable.receiverId, userId),
                ),
            )
            .orderBy(messageTable.createdAt, "desc")
            
        
            
        
        const chatPartnersId = [
            ...new Set(
                messages.map((message) =>
                    message.senderId === userId
                        ? message.receiverId
                        : message.senderId
                )
            )
        ]

        const chatPartners = await db.select({
            id: users.id,
            username: users.username,
            avatar: users.avatar,
            email: users.email
        }).from(users).where(inArray(users.id, chatPartnersId))
        
        return res.status(200).json(chatPartners) 

    } catch (error) {
        console.log("Error while getting chat partners: ", error)
        return res.status(500).json({ message: "Something went wrong while getting chat partners", error: error.message});
    }
})