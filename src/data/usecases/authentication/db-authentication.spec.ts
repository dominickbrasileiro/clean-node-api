import { AccountModel } from '../../../domain/models/account';
import { AuthenticationModel } from '../../../domain/usecases/authentication';
import { LoadAccountByEmailRepository } from '../../protocols/database/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@example.com',
  password: 'any_password',
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

const makeFakeCredentials = (): AuthenticationModel => ({
  email: 'any_email@example.com',
  password: 'any_password',
});

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepository: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepository);

  return { sut, loadAccountByEmailRepository };
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

  it('should throw if LoadAccountByEmailRepository throw', async () => {
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
});
