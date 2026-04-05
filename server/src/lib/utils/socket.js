import { Server } from "socket.io"
import http from "http"
import express from "express"
import { socketAuthMiddleware } from "../../middlewares/socketAuth.middleware.js"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://chatapp-8lw.pages.dev",
        credentials: true,
        headers: ["Content-Type", "Authorization"],
    },
});

io.use(socketAuthMiddleware)

export function getRecipientSocketId(userId) {
    return userSocketMap[String(userId)]
}

// sare online users ko get krne k liye
const userSocketMap = {}

io.on("connection", (socket) => {
    console.log("user connected: ", socket.user.username)
    const userId = socket.userId
    
    userSocketMap[userId] = socket.id
    
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    
    socket.on("disconnect", () => {
        console.log("user disconnected: ", socket.user.username)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
    console.log(userSocketMap)
})


export {io, server, app}