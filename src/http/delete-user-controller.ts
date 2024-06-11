import z from "zod";
import { makeDeleteUseCase } from "./factory/make-delete-usecase";
import { FastifyReply, FastifyRequest } from "fastify";

export async function deleteUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const deleteUserBodySchema = z.object({
    id: z.string(),
  });

  const { id } = deleteUserBodySchema.parse(request.body);

  try {
    const deleteUsecase = makeDeleteUseCase();

    const user = await deleteUsecase.execute({
      id,
    });

    return reply.status(200).send({ user });
  } catch (err) {
    throw err;
  }
}
