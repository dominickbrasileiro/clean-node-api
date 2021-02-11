import {
  Hasher,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@example.com',
  password: 'valid_password',
});

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@example.com',
  password: 'hashed_password',
});

const makeHasher = (): Hasher => {
  class HasherStub {
    async hash(_: string): Promise<string> {
      return 'hashed_password';
    }
  }

  const hasherStub = new HasherStub();

  return hasherStub;
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub {
    async add(_: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();

      return fakeAccount;
    }
  }

  const addAccountRepositoryStub = new AddAccountRepositoryStub();

  return addAccountRepositoryStub;
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadAccountByEmail(): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepository: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();

  const addAccountRepositoryStub = makeAddAccountRepository();
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository();

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepository,
  );

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepository,
  };
};

describe('DbAddAccount Usecase', () => {
  it('should call Hasher with provided password', async () => {
    const { sut, hasherStub } = makeSut();

    const encryptSpy = jest.spyOn(hasherStub, 'hash');

    const accountData = makeFakeAccountData();

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();

    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const accountData = makeFakeAccountData();

    await expect(sut.add(accountData)).rejects.toThrow();
  });

  it('should call AddAccountRepository with provided values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const accountData = makeFakeAccountData();

    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@example.com',
      password: 'hashed_password',
    });
  });

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const accountData = makeFakeAccountData();

    await expect(sut.add(accountData)).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const accountData = makeFakeAccountData();

    const account = await sut.add(accountData);

    expect(account).toEqual(makeFakeAccount());
  });

  it('should call LoadAccountByEmailRepository with correct e-mail', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();

    const loadSpy = jest.spyOn(
      loadAccountByEmailRepository,
      'loadAccountByEmail',
    );

    const accountData = makeFakeAccountData();

    await sut.add(accountData);

    expect(loadSpy).toHaveBeenCalledWith(accountData.email);
  });
});
