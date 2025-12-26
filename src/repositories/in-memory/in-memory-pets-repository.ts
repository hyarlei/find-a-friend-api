import { Pet, Prisma } from '@prisma/client'
import { FindAllParams, PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about ?? null,
      age: data.age,
      size: data.size,
      energy_level: data.energy_level,
      independence_level: data.independence_level,
      environment: data.environment,
      org_id: data.org_id,
      created_at: new Date(),
    }

    this.items.push(pet)

    return pet
  }

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async findAll(params: FindAllParams) {
    // Filtra pelos atributos opcionais do Pet se eles existirem
    const pets = this.items.filter((item) => {
      if (params.age && item.age !== params.age) return false
      if (params.size && item.size !== params.size) return false
      if (params.energy_level && item.energy_level !== params.energy_level) return false
      
      return true
    })

    return pets
  }
}