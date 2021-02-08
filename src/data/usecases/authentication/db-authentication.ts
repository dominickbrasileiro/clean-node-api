import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

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

    const accessToken = await this.encrypter.encrypt(account.id);

    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken,
    );

    return accessToken;
  }
}
