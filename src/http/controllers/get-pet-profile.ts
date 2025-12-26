import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetPetProfileUseCase } from "@/use-cases/factories/make-get-pet-profile-use-case";

export async function getPetProfile(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const getPetProfileParamsSchema = z.object({
        id: z.string().uuid(),
    });

    const { id } = getPetProfileParamsSchema.parse(request.params);

    try {
        const getPetProfileUseCase = makeGetPetProfileUseCase();

        const { pet } = await getPetProfileUseCase.execute({
            petId: id,
        });

        return reply.status(200).send({
            pet,
        });
    } catch (err) {
        return reply.status(404).send({ message: "Pet not found" });
    }
}
