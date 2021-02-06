import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  TokenGenerator,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

  private readonly hashComparer: HashComparer;

  private readonly tokenGenerator: TokenGenerator;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(credentials: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadAccountByEmail(
      credentials.email,
    );

    if (!account) {
      return null;
    }

    const passwordMatch = await this.hashComparer.compare(
      credentials.password,
      account.password,
    );

    if (!passwordMatch) {
      return null;
    }

    const accessToken = await this.tokenGenerator.generate(account.id);

    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken,
    );

    return accessToken;
  }
}
