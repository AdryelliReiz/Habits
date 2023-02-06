import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import { appRoutes } from "./routes"

const app = Fastify()

app.register(cors)

app.register(jwt, {secret: "$78d@mMq*3t%a9z0*@wfj*H6G4I9O4F#f%o9J6@f!Kl7$gA"})

app.register(appRoutes)

app.listen({
    port: 3333,
    host: '0.0.0.0',
}).then(() => {
    console.log("HTTP Server running...")
})