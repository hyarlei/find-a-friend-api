import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository"
import { beforeEach, describe, expect, it } from "vitest"
import { CreatePetUseCase } from "./create-pet"

let petsRepository: InMemoryPetsRepository
let sut: CreatePetUseCase

describe("Create Pet Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new CreatePetUseCase(petsRepository)
  })

  it("should be able to create a new pet", async () => {
    const { pet } = await sut.execute({
      name: "Thor",
      about: null,
      age: "adult",
      size: "medium",
      energy_level: "high",
      independence_level: "medium",
      environment: "open",
      org_id: "org-id-01",
    })

    // Espera que o pet tenha sido criado e tenha um ID
    expect(pet.id).toEqual(expect.any(String))
    expect(pet.org_id).toEqual("org-id-01")
  })
})
