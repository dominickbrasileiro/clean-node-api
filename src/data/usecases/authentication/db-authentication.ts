import {
  Authentication,
  AuthenticationModel,
} from '../../../domain/usecases/authentication';
import { HashComparer } from '../../protocols/criptography/hash-comparer';
import { TokenGenerator } from '../../protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/database/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashComparer: HashComparer;

  private readonly tokenGenerator: TokenGenerator;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(credentials: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadAccountByEmail(
      credentials.email,
    );

    if (account) {
      await this.hashComparer.compare(credentials.password, account.password);

      await this.tokenGenerator.generate(account.id);
    }

    return null;
  }
}
