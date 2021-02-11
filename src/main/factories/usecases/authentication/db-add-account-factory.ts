import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../../infra/database/mongodb/account/account-mongo-repository';
import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account';
import { AddAccount } from '../../../../domain/usecases/add-account';

export const makeDbAddAccount = (): AddAccount => {
  const encrypter = new BcryptAdapter(12);

  const accountMongoRepository = new AccountMongoRepository();

  return new DbAddAccount(
    encrypter,
    accountMongoRepository,
    accountMongoRepository,
  );
};
