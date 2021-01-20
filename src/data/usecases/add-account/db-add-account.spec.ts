import { Encrypter } from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    async encrypt(_: string): Promise<string> {
      return 'hashed_password';
    }
  }

  const encrypterStub = new EncrypterStub();

  return encrypterStub;
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();

  const sut = new DbAddAccount(encrypterStub);

  return { sut, encrypterStub };
};

describe('DbAddAccount Usecase', () => {
  it('should call Encrypter with provided password', async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@example.com',
      password: 'valid_password',
    };

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();

    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@example.com',
      password: 'valid_password',
    };

    await expect(sut.add(accountData)).rejects.toThrow();
  });
});