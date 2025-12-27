import { Org, Prisma } from "@prisma/client"
import { randomUUID } from "node:crypto"
import { OrgsRepository } from "../orgs-repository"

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      address: data.address,
      phone: data.phone,
      created_at: new Date(),
    }

    this.items.push(org)

    return org
  }
}
