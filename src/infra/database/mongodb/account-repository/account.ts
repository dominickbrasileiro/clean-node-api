import { AddAccountRepository } from '../../../../data/protocols/database/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/database/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/database/update-access-token-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    const [account] = result.ops;

    return MongoHelper.map(account);
  }

  async loadAccountByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const account = await accountCollection.findOne({ email });

    return account ? MongoHelper.map(account) : null;
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.updateOne(
      { _id: id },
      {
        $set: { accessToken },
      },
    );
  }
}
