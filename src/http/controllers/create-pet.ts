import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreatePetUseCase } from "@/use-cases/factories/make-create-pet-use-case";

export async function createPet(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();

    const createPetBodySchema = z.object({
        name: z.string(),
        about: z.string().nullable(),
        age: z.string(),
        size: z.string(),
        energy_level: z.string(),
        independence_level: z.string(),
        environment: z.string(),
    });

    const {
        name,
        about,
        age,
        size,
        energy_level,
        independence_level,
        environment,
    } = createPetBodySchema.parse(request.body);

    const org_id = (request.user as { sub: string }).sub;

    try {
        const createPetUseCase = makeCreatePetUseCase();

        await createPetUseCase.execute({
            name,
            about,
            age,
            size,
            energy_level,
            independence_level,
            environment,
            org_id,
        });
    } catch (err) {
        return reply.status(500).send({ message: "Internal Server Error" });
    }

    return reply.status(201).send();
}
