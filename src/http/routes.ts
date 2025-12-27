import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { authenticate } from "./controllers/authenticate"
import { createPet } from "./controllers/create-pet"
import { getPetProfile } from "./controllers/get-pet-profile"
import { register } from "./controllers/register"
import { searchPets } from "./controllers/search-pets"

export async function appRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>()

  typedApp.post(
    "/orgs",
    {
      schema: {
        tags: ["ORGs"],
        summary: "Create a new ORG",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
          address: z.string(),
          phone: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    register,
  )

  typedApp.post(
    "/sessions",
    {
      schema: {
        tags: ["AUTH"],
        summary: "Authenticate (Login)",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    authenticate,
  )

  typedApp.post(
    "/orgs/pets",
    {
      schema: {
        tags: ["PETS"],
        summary: "Create a new Pet (Requires Auth)",
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string(),
          about: z.string().nullable(),
          age: z.string(),
          size: z.string(),
          energy_level: z.string(),
          independence_level: z.string(),
          environment: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    createPet,
  )

  typedApp.get(
    "/pets",
    {
      schema: {
        tags: ["PETS"],
        summary: "Search for pets",
        querystring: z.object({
          city: z.string(),
          age: z.string().optional(),
          size: z.string().optional(),
          energy_level: z.string().optional(),
        }),
        response: {
          200: z.object({
            pets: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                age: z.string(),
                size: z.string(),
                energy_level: z.string(),
                about: z.string().nullable().optional(),
                city: z.string().optional(),
              }),
            ),
          }),
        },
      },
    },
    searchPets,
  )

  typedApp.get(
    "/pets/:id",
    {
      schema: {
        tags: ["PETS"],
        summary: "Get Pet Profile",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: z.object({
            pet: z.object({
              id: z.string().uuid(),
              name: z.string(),
              about: z.string().nullable(),
              age: z.string(),
              size: z.string(),
              energy_level: z.string(),
              independence_level: z.string(),
              environment: z.string(),
              org_id: z.string(),
            }),
          }),
        },
      },
    },
    getPetProfile,
  )
}
