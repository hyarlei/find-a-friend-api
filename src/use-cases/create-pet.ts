import { Pet } from "@prisma/client"
import { PetsRepository } from "../repositories/pets-repository"

interface CreatePetUseCaseRequest {
  name: string
  about: string | null
  age: string
  size: string
  energy_level: string
  independence_level: string
  environment: string
  org_id: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    name,
    about,
    age,
    size,
    energy_level,
    independence_level,
    environment,
    org_id,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      size,
      energy_level,
      independence_level,
      environment,
      org_id,
    })

    return {
      pet,
    }
  }
}
