import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
        const authenticateUseCase = makeAuthenticateUseCase();

        const { org } = await authenticateUseCase.execute({
            email,
            password,
        });

        // Gerando o token JWT
        const token = await reply.jwtSign(
            {}, // Payload (dados adicionais se quiser)
            {
                sign: {
                    sub: org.id, // Subject: quem é o dono do token (ID da ORG)
                },
            }
        );

        return reply.status(200).send({
            token,
        });
    } catch (err) {
        return reply.status(400).send({ message: "Invalid credentials." });
    }
}
