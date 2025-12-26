import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { appRoutes } from "./http/routes";
import { env } from "./env";

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET!
});

app.register(appRoutes);