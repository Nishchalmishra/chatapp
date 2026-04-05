import fastifySensible from "@fastify/sensible" 
import Fastify from "fastify"
import dotenv from "dotenv"
import path from "path"

dotenv.config({quiet: true})
const fastify = Fastify({ logger: true })
const port = 5001

await fastify.register(fastifySensible)

fastify.get("/", async(request, reply) => {
    return { hello: "world" };
})

const start = () => {
    try {
        fastify.listen({ port: port})
        fastify.log.info(`Server is running on port http://localhost:${port}`)
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}

start()