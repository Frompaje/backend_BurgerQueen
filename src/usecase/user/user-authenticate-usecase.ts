import { InvalidCredentialsError } from "../../err/user/invalid-credentials-error";
import { UserDoesntExist } from "../../err/user/user-doesnt-exist";
import { UserRepository } from "../../interface/user-repository";
import { Hash } from "../../repository/adapter/password-hash";

interface AuthenticateUseCaseRequest {
  id: string;
  email: string;
  password: string;
}

export class AuthenticateUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: Hash
  ) {}
  async execute({ id, email, password }: AuthenticateUseCaseRequest) {
    const user = await this.userRepository.findUserByIdAndEmail(id, email);

    if (!user) {
      throw new UserDoesntExist();
    }
    const isSamePassword = await this.hasher.compare(password, user.password);

    if (!isSamePassword) {
      throw new InvalidCredentialsError();
    }

    return user;
  }
}
