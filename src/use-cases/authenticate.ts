import { compare } from "bcryptjs";
import { OrgsRepository } from "../repositories/orgs-repository";
import { Org } from "@prisma/client";

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUseCaseResponse {
    org: Org;
}

export class AuthenticateUseCase {
    constructor(private orgsRepository: OrgsRepository) { }

    async execute({
        email,
        password,
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const org = await this.orgsRepository.findByEmail(email);

        if (!org) {
            throw new Error("Invalid credentials.");
        }

        const doesPasswordMatch = await compare(password, org.password_hash);

        if (!doesPasswordMatch) {
            throw new Error("Invalid credentials.");
        }

        return {
            org,
        };
    }
}
