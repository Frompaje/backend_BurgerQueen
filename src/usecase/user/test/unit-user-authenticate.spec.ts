import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeUserMock } from "./factory/make-user";
import { repositoryAndHasherDependencies } from "./factory/make-repository-hasher-depedencies";
import { InvalidCredentialsError } from "../../../err/user/invalid-credentials-error";
import { UserDoesntExist } from "../../../err/user/user-doesnt-exist";
import { UserRepository } from "../../../interface/user-repository";
import { Hash } from "../../../repository/adapter/password-hash";
import { AuthenticateUseCase } from "../user-authenticate-usecase";

describe("Authenticate user Use Case", () => {
  let sut: AuthenticateUseCase;
  let userRepository: UserRepository;
  let hasher: Hash;
  beforeEach(() => {
    const depedencies = repositoryAndHasherDependencies();

    userRepository = depedencies.userRepository;
    hasher = depedencies.hasher;

    sut = new AuthenticateUseCase(userRepository, hasher);
  });
  describe("Sucess", () => {
    it("Should generate a jwt token", async () => {
      const userMocking = makeUserMock();

      vi.spyOn(userRepository, "findUserByIdAndEmail").mockResolvedValue(
        userMocking
      );
      vi.spyOn(hasher, "compare").mockResolvedValue(true);

      const token = await sut.execute({
        id: userMocking.id,
        email: userMocking.email,
        password: userMocking.password,
      });

      expect(userRepository.findUserByIdAndEmail).toBeCalledTimes(1);
      expect(hasher.compare).toBeCalledTimes(1);
      expect(userRepository.findUserByIdAndEmail).toBeCalledWith(
        userMocking.id,
        userMocking.email
      );
      expect(token).toBeDefined();
    });
  });
  describe("Error", () => {
    it("Shouldn't authenticate, because the user doesn't exist", () => {
      const userMocking = makeUserMock();
      vi.spyOn(userRepository, "findUserByIdAndEmail").mockResolvedValue(null);

      const errResultUser = sut.execute({
        id: userMocking.id,
        email: userMocking.email,
        password: userMocking.password,
      });
      expect(errResultUser).rejects.toBeInstanceOf(UserDoesntExist);
    });
    it("Shouldn't authenticate the user, because the passwords aren't the same ", () => {
      const userMocking = makeUserMock();
      vi.spyOn(userRepository, "findUserByIdAndEmail").mockResolvedValue(
        userMocking
      );

      vi.spyOn(hasher, "compare").mockResolvedValue(false);

      const errResultUser = sut.execute({
        id: userMocking.id,
        email: userMocking.email,
        password: userMocking.password,
      });
      expect(errResultUser).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
  });
});
