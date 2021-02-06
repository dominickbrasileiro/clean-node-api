import { DbAuthentication } from './db-authentication';
import {
  AccountModel,
  AuthenticationModel,
  HashComparer,
  TokenGenerator,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@example.com',
  password: 'hashed_password',
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadAccountByEmail(): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(): Promise<void> {
      return null;
    }
  }

  return new UpdateAccessTokenRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(): Promise<boolean> {
      return true;
    }
  }

  return new HashComparerStub();
};

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(): Promise<string> {
      return 'any_token';
    }
  }

  return new TokenGeneratorStub();
};

const makeFakeCredentials = (): AuthenticationModel => ({
  email: 'any_email@example.com',
  password: 'any_password',
});

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepository: LoadAccountByEmailRepository;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();

  const sut = new DbAuthentication(
    loadAccountByEmailRepository,
    updateAccessTokenRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  );

  return {
    sut,
    loadAccountByEmailRepository,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct e-mail', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();

    const loadSpy = jest.spyOn(
      loadAccountByEmailRepository,
      'loadAccountByEmail',
    );

    const credentials = makeFakeCredentials();

    await sut.auth(credentials);

    expect(loadSpy).toHaveBeenCalledWith(credentials.email);
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepository, 'loadAccountByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const credentials = makeFakeCredentials();

    await expect(sut.auth(credentials)).rejects.toThrow();
  });

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepository, 'loadAccountByEmail')
      .mockReturnValueOnce(null);

    const credentials = makeFakeCredentials();

    const accessToken = await sut.auth(credentials);

    expect(accessToken).toBeNull();
  });

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();

    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    const credentials = makeFakeCredentials();

    await sut.auth(credentials);

    expect(compareSpy).toHaveBeenCalledWith(
      credentials.password,
      'hashed_password',
    );
  });

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const credentials = makeFakeCredentials();

    await expect(sut.auth(credentials)).rejects.toThrow();
  });

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockImplementationOnce(async () => false);

    const credentials = makeFakeCredentials();

    const accessToken = await sut.auth(credentials);

    expect(accessToken).toBeNull();
  });

  it('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    const credentials = makeFakeCredentials();

    await sut.auth(credentials);

    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });

  it('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const credentials = makeFakeCredentials();

    await expect(sut.auth(credentials)).rejects.toThrow();
  });

  it('should return a access token on success', async () => {
    const { sut } = makeSut();

    const credentials = makeFakeCredentials();

    const accessToken = await sut.auth(credentials);

    expect(accessToken).toBe('any_token');
  });

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken',
    );

    const credentials = makeFakeCredentials();

    await sut.auth(credentials);

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const credentials = makeFakeCredentials();

    await expect(sut.auth(credentials)).rejects.toThrow();
  });
});
