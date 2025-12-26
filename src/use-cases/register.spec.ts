import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository";
import { compare } from "bcryptjs";

let orgsRepository: InMemoryOrgsRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
    beforeEach(() => {
        orgsRepository = new InMemoryOrgsRepository();
        sut = new RegisterUseCase(orgsRepository);
    });

    it("should be able to register", async () => {
        const { org } = await sut.execute({
            name: "Cãopanheiros",
            email: "dog@example.com",
            password: "123456",
            address: "Rua Teste",
            phone: "1199999999",
        });

        expect(org.id).toEqual(expect.any(String));
    });

    it("should hash user password upon registration", async () => {
        const { org } = await sut.execute({
            name: "Cãopanheiros",
            email: "dog@example.com",
            password: "123456",
            address: "Rua Teste",
            phone: "1199999999",
        });

        const isPasswordCorrectlyHashed = await compare(
            "123456",
            org.password_hash
        );

        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it("should not be able to register with same email twice", async () => {
        const email = "dog@example.com";

        await sut.execute({
            name: "Org 1",
            email,
            password: "123456",
            address: "Rua Teste",
            phone: "1199999999",
        });

        await expect(() =>
            sut.execute({
                name: "Org 2",
                email,
                password: "123456",
                address: "Rua Teste",
                phone: "1199999999",
            })
        ).rejects.toBeInstanceOf(Error);
    });
});
