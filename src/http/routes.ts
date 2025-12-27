import { FastifyInstance } from "fastify"
import { authenticate } from "./controllers/authenticate"
import { createPet } from "./controllers/create-pet"
import { getPetProfile } from "./controllers/get-pet-profile"
import { register } from "./controllers/register"
import { searchPets } from "./controllers/search-pets"

export async function appRoutes(app: FastifyInstance) {
  app.post("/orgs", register)
  app.post("/sessions", authenticate)
  app.post("/pets", createPet)
  app.get("/pets/:id", getPetProfile)
  app.get("/pets", searchPets)
}
