import express from "express"
import dotenv from "dotenv"
import chalk from "chalk"
import path from "path"
import cors from "cors"

import authRoute from "./routes/auth.route.js"
import messageRoute from "./routes/message.route.js"
import cookieParser from "cookie-parser"

import { app, server } from "./lib/utils/socket.js"

dotenv.config({quiet: true})
// const app = express()
const port = process.env.PORT || 5000
const __dirname = path.resolve()

app.use(express.json({
    limit: "50mb"
}))
app.use(cookieParser())
app.use(
    cors({
        origin: "https://e1ebdee5.chatapp-8lw.pages.dev",
        credentials: true,
        headers: ["Content-Type", "Authorization"],
    }),
);
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

app.use("/api/auth", authRoute)
app.use("/api/message", messageRoute)

app.get("/", (req, res) => {
    res.send("Server is alive 😌");
});

if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")))

    app.get((req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"))
    })
}

server.listen(port, "0.0.0.0", () => {
    console.log(chalk.green(`Server is running on port http://localhost:${port}`))
})
