import { Org } from "@prisma/client"
import { hash } from "bcryptjs"
import { OrgsRepository } from "../repositories/orgs-repository"

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
  address: string
  phone: string
}

interface RegisterUseCaseResponse {
  org: Org
}

export class RegisterUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    password,
    address,
    phone,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new Error("E-mail already exists.")
    }

    const password_hash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      name,
      email,
      password_hash,
      address,
      phone,
    })

    return {
      org,
    }
  }
}
