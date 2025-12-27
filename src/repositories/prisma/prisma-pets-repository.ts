import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { PetsRepository } from "../pets-repository"

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async findAll(params: {
    city?: string
    age?: string
    size?: string
    energy_level?: string
  }) {
    const pets = await prisma.pet.findMany({
      where: {
        age: params.age,
        size: params.size,
        energy_level: params.energy_level,
        org: params.city
          ? {
              address: {
                contains: params.city,
              },
            }
          : undefined,
      },
    })

    return pets
  }
}
