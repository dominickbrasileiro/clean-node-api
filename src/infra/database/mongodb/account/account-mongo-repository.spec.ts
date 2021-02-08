import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  it('should return an account on add success', async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@example.com',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@example.com');
    expect(account.password).toBe('any_password');
  });

  it('should return an account on loadAccountByEmail success', async () => {
    const sut = makeSut();

    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@example.com',
      password: 'any_password',
    });

    const account = await sut.loadAccountByEmail('any_email@example.com');

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@example.com');
    expect(account.password).toBe('any_password');
  });

  it('should return null if loadByEmail fails', async () => {
    const sut = makeSut();

    const result = await sut.loadAccountByEmail('any_email@example.com');

    expect(result).toBeNull();
  });

  it('should update the account accesToken on updateAccessToken success', async () => {
    const sut = makeSut();

    const result = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@example.com',
      password: 'any_password',
    });

    const [account] = result.ops;
    expect(account.accessToken).toBeFalsy();

    await sut.updateAccessToken(account._id, 'any_token');

    const updatedAccount = await accountCollection.findOne(account._id);

    expect(updatedAccount).toBeTruthy();
    expect(updatedAccount.accessToken).toBe('any_token');
  });
});
