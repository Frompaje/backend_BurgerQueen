import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { InvalidCredentialsError } from "./user/invalid-credentials-error";
import { UserAlreadyExistsError } from "./user/user-already-exists.error";
import { UserDoesntExist } from "./user/user-doesnt-exist";
import { ProductAlreadyExistsError } from "./product/product-already-exists";
import { ProductDoesntExist } from "./product/product-doesnt-exist";
import { OrderDoesntExist } from "./product/order-doesnt-exist";

export function errorHandling(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (error instanceof UserAlreadyExistsError) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof UserDoesntExist) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof InvalidCredentialsError) {
    return reply.status(400).send({
      message: error.message,
    });
  }
  if (error instanceof ProductAlreadyExistsError) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof ProductDoesntExist) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof OrderDoesntExist) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  console.log("RAPAIZ, DEU UM ERRO:", error);

  return reply.status(500).send({ message: "internal server error" });
}
