import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols';
import {
  AddAccount,
  AddAccountModel,
  Hasher,
  AccountModel,
  AddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadAccountByEmail(
      accountData.email,
    );

    if (account) {
      return null;
    }

    const hashedPassword = await this.encrypter.hash(accountData.password);

    const newAccount = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });

    return newAccount;
  }
}
