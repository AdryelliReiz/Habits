import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import { appRoutes } from "./routes"

const app = Fastify()

app.register(cors)

app.register(jwt, {secret: process.env.JWT_SECRET || "SUPER SECRET"})

app.register(appRoutes)

app.listen({
    port: 3333,
    host: '0.0.0.0',
}).then(() => {
    console.log("HTTP Server running...")
})